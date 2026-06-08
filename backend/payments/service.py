"""
Stripe payment service for handling all payment operations.
This service handles checkout sessions, webhook verification, and transaction processing.
"""

import os
import hmac
import hashlib
import json
import logging
from datetime import datetime, UTC
from typing import Optional, Dict, Any
import stripe
from models import Transaction, User, WebhookLog, Invoice, PaymentStatus
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

# Initialize Stripe (will use placeholder keys initially, swap in real keys later)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder_key")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_placeholder_secret")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "pk_test_placeholder_key")


class StripePaymentException(Exception):
    """Custom exception for Stripe-related errors."""
    pass


class WebhookVerificationError(StripePaymentException):
    """Raised when webhook signature verification fails."""
    pass


class PaymentProcessingError(StripePaymentException):
    """Raised when payment processing fails."""
    pass


class AmountMismatchError(StripePaymentException):
    """Raised when webhook amount doesn't match stored amount."""
    pass


class StripePaymentService:
    """Service class for handling Stripe payment operations."""

    @staticmethod
    def verify_webhook_signature(request_body: str, signature_header: str) -> Dict[str, Any]:
        """
        Verify the Stripe webhook signature to ensure the webhook came from Stripe.

        Args:
            request_body: Raw request body (must not be parsed JSON)
            signature_header: Stripe-Signature header value

        Returns:
            Parsed webhook event payload

        Raises:
            WebhookVerificationError: If signature verification fails
        """
        try:
            # Stripe signs the request using timestamp and signature
            # Format: t=timestamp,v1=signature

            if STRIPE_WEBHOOK_SECRET == "whsec_placeholder_secret":
                logger.warning("Using placeholder webhook secret - webhooks will not be verified until real key is set")
                return json.loads(request_body)

            # Verify signature
            event = stripe.Webhook.construct_event(
                payload=request_body,
                sig_header=signature_header,
                secret=STRIPE_WEBHOOK_SECRET
            )

            logger.info(f"Webhook verified: {event['type']}")
            return event

        except ValueError as e:
            logger.error(f"Invalid webhook payload: {str(e)}")
            raise WebhookVerificationError("Invalid webhook payload")
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Webhook signature verification failed: {str(e)}")
            raise WebhookVerificationError("Webhook signature verification failed")

    @staticmethod
    def create_checkout_session(
        user_id: int,
        amount_cents: int,
        transaction_type: str,
        success_url: str,
        cancel_url: str,
        db: Session
    ) -> Dict[str, str]:
        """
        Create a Stripe checkout session for payment.

        Args:
            user_id: ID of the user making the payment
            amount_cents: Amount in cents (e.g., 20000 for $200)
            transaction_type: Type of transaction (e.g., "agent_registration")
            success_url: URL to redirect to after successful payment
            cancel_url: URL to redirect to if payment is cancelled
            db: Database session

        Returns:
            Dictionary with session_id and checkout_url

        Raises:
            PaymentProcessingError: If session creation fails
        """
        try:
            # Validate amount
            if amount_cents <= 0:
                raise ValueError("Amount must be greater than 0")

            # Generate idempotency key
            idempotency_key = os.urandom(32).hex()

            # If using placeholder key, create a mock response
            if stripe.api_key == "sk_test_placeholder_key":
                logger.warning("Using placeholder Stripe key - returning mock session")
                mock_session = {
                    "id": f"cs_test_{idempotency_key[:20]}",
                    "url": f"{success_url}?session_id=cs_test_{idempotency_key[:20]}",
                    "payment_intent": f"pi_test_{idempotency_key[:20]}"
                }
                session_data = mock_session
            else:
                # Create real Stripe session
                session_data = stripe.checkout.Session.create(
                    payment_method_types=["card"],
                    line_items=[
                        {
                            "price_data": {
                                "currency": "usd",
                                "product_data": {
                                    "name": f"gulfvista {transaction_type.replace('_', ' ').title()}",
                                },
                                "unit_amount": amount_cents,
                            },
                            "quantity": 1,
                        }
                    ],
                    mode="payment",
                    success_url=success_url,
                    cancel_url=cancel_url,
                    metadata={
                        "user_id": str(user_id),
                        "transaction_type": transaction_type,
                        "idempotency_key": idempotency_key
                    },
                    idempotency_key=idempotency_key
                )

            # Store transaction in database
            transaction = Transaction(
                user_id=user_id,
                stripe_session_id=session_data["id"],
                stripe_payment_intent_id=session_data.get("payment_intent"),
                amount_cents=amount_cents,
                currency="USD",
                transaction_type=transaction_type,
                description=f"{transaction_type.replace('_', ' ').title()} - ${amount_cents / 100:.2f}",
                status=PaymentStatus.PENDING,
                idempotency_key=idempotency_key,
                payment_metadata={
                    "created_at": datetime.now(UTC).isoformat(),
                    "session_id": session_data["id"]
                }
            )

            db.add(transaction)
            db.commit()
            db.refresh(transaction)

            logger.info(f"Checkout session created: {session_data['id']} for user {user_id}")

            return {
                "session_id": session_data["id"],
                "checkout_url": session_data.get("url", ""),
                "transaction_id": str(transaction.id)
            }

        except stripe.error.StripeAPIError as e:
            logger.error(f"Stripe API error creating checkout session: {str(e)}")
            raise PaymentProcessingError(f"Payment session creation failed: {str(e)}")
        except Exception as e:
            logger.error(f"Error creating checkout session: {str(e)}")
            raise PaymentProcessingError(f"Failed to create payment session: {str(e)}")

    @staticmethod
    def get_session_status(session_id: str) -> Dict[str, Any]:
        """
        Get the status of a checkout session.

        Args:
            session_id: Stripe checkout session ID

        Returns:
            Dictionary with session status and details
        """
        try:
            if stripe.api_key == "sk_test_placeholder_key":
                logger.warning("Using placeholder Stripe key - returning mock session status")
                return {
                    "status": "open",
                    "payment_status": "unpaid",
                    "session_id": session_id
                }

            session = stripe.checkout.Session.retrieve(session_id)

            return {
                "status": session["status"],
                "payment_status": session["payment_status"],
                "session_id": session["id"],
                "amount": session.get("amount_total", 0),
                "currency": session.get("currency", "usd")
            }

        except stripe.error.StripeAPIError as e:
            logger.error(f"Error retrieving session status: {str(e)}")
            raise PaymentProcessingError(f"Failed to retrieve session status: {str(e)}")

    @staticmethod
    def process_webhook_payment_completed(
        event_data: Dict[str, Any],
        db: Session
    ) -> Optional[Transaction]:
        """
        Process a checkout.session.completed webhook event.

        Args:
            event_data: Stripe webhook event data
            db: Database session

        Returns:
            Updated Transaction object

        Raises:
            PaymentProcessingError: If payment processing fails
        """
        try:
            session_data = event_data["data"]["object"]
            session_id = session_data["id"]

            # Get transaction from database
            transaction = db.query(Transaction).filter(
                Transaction.stripe_session_id == session_id
            ).first()

            if not transaction:
                logger.warning(f"Transaction not found for session {session_id}")
                raise PaymentProcessingError(f"Transaction not found for session {session_id}")

            # Verify amount matches
            webhook_amount = session_data.get("amount_total", 0)
            if webhook_amount != transaction.amount_cents:
                logger.error(
                    f"Amount mismatch for session {session_id}: "
                    f"webhook={webhook_amount}, stored={transaction.amount_cents}"
                )
                raise AmountMismatchError("Payment amount mismatch with stored transaction")

            # Update transaction status
            transaction.status = PaymentStatus.COMPLETED
            transaction.completed_at = datetime.now(UTC)
            transaction.stripe_payment_intent_id = session_data.get("payment_intent")
            transaction.payment_metadata["completed_at"] = datetime.now(UTC).isoformat()

            # Update user to agent_admin if agent_registration
            if transaction.transaction_type == "agent_registration":
                user = db.query(User).filter(User.id == transaction.user_id).first()
                if user:
                    user.is_agent_verified = True
                    logger.info(f"User {user.id} verified as agent")

            db.commit()
            db.refresh(transaction)

            logger.info(f"Payment completed for transaction {transaction.id}")
            return transaction

        except PaymentProcessingError:
            raise
        except Exception as e:
            logger.error(f"Error processing payment completion: {str(e)}")
            raise PaymentProcessingError(f"Failed to process payment: {str(e)}")

    @staticmethod
    def process_webhook_payment_failed(
        event_data: Dict[str, Any],
        db: Session
    ) -> Optional[Transaction]:
        """
        Process a payment_intent.payment_failed webhook event.

        Args:
            event_data: Stripe webhook event data
            db: Database session

        Returns:
            Updated Transaction object
        """
        try:
            payment_intent_id = event_data["data"]["object"]["id"]

            # Find transaction by payment intent
            transaction = db.query(Transaction).filter(
                Transaction.stripe_payment_intent_id == payment_intent_id
            ).first()

            if transaction:
                transaction.status = PaymentStatus.FAILED
                transaction.updated_at = datetime.now(UTC)
                db.commit()
                db.refresh(transaction)
                logger.info(f"Payment failed for transaction {transaction.id}")

            return transaction

        except Exception as e:
            logger.error(f"Error processing payment failure: {str(e)}")
            return None

    @staticmethod
    def log_webhook(
        event_id: str,
        event_type: str,
        payload: Dict[str, Any],
        db: Session,
        error_details: Optional[str] = None
    ) -> WebhookLog:
        """
        Log a webhook event to the database for audit trail.

        Args:
            event_id: Stripe event ID
            event_type: Type of webhook event
            payload: Full webhook payload
            db: Database session
            error_details: Optional error message if processing failed

        Returns:
            Created WebhookLog object
        """
        try:
            webhook_log = WebhookLog(
                stripe_event_id=event_id,
                event_type=event_type,
                payload=payload,
                processed=error_details is None,
                error_details=error_details
            )

            db.add(webhook_log)
            db.commit()
            db.refresh(webhook_log)

            return webhook_log

        except Exception as e:
            logger.error(f"Error logging webhook: {str(e)}")
            return None

    @staticmethod
    def create_invoice(
        transaction_id: int,
        db: Session
    ) -> Optional[Invoice]:
        """
        Create an invoice for a completed transaction.

        Args:
            transaction_id: ID of the transaction
            db: Database session

        Returns:
            Created Invoice object
        """
        try:
            transaction = db.query(Transaction).filter(
                Transaction.id == transaction_id
            ).first()

            if not transaction:
                logger.error(f"Transaction {transaction_id} not found")
                return None

            if transaction.status != PaymentStatus.COMPLETED:
                logger.warning(f"Cannot create invoice for non-completed transaction {transaction_id}")
                return None

            # Generate invoice number
            invoice_number = f"INV-{transaction.id}-{datetime.now(UTC).strftime('%Y%m%d')}"

            invoice = Invoice(
                transaction_id=transaction_id,
                user_id=transaction.user_id,
                invoice_number=invoice_number,
                amount_cents=transaction.amount_cents,
                currency=transaction.currency,
                description=transaction.description
            )

            db.add(invoice)
            db.commit()
            db.refresh(invoice)

            logger.info(f"Invoice created: {invoice_number}")
            return invoice

        except Exception as e:
            logger.error(f"Error creating invoice: {str(e)}")
            return None

    @staticmethod
    def refund_transaction(
        transaction_id: int,
        amount_cents: Optional[int] = None,
        db: Session = None
    ) -> Dict[str, str]:
        """
        Refund a transaction (partial or full).

        Args:
            transaction_id: ID of the transaction to refund
            amount_cents: Amount to refund in cents (None for full refund)
            db: Database session

        Returns:
            Dictionary with refund information
        """
        try:
            transaction = db.query(Transaction).filter(
                Transaction.id == transaction_id
            ).first()

            if not transaction:
                raise PaymentProcessingError(f"Transaction {transaction_id} not found")

            if transaction.status != PaymentStatus.COMPLETED:
                raise PaymentProcessingError("Can only refund completed transactions")

            refund_amount = amount_cents or transaction.amount_cents

            if stripe.api_key == "sk_test_placeholder_key":
                logger.warning("Using placeholder Stripe key - returning mock refund")
                return {
                    "refund_id": f"re_test_mock",
                    "status": "succeeded",
                    "amount": str(refund_amount / 100)
                }

            # Process actual refund
            refund = stripe.Refund.create(
                payment_intent=transaction.stripe_payment_intent_id,
                amount=refund_amount
            )

            # Update transaction if full refund
            if refund_amount == transaction.amount_cents:
                transaction.status = PaymentStatus.REFUNDED
                db.commit()

            logger.info(f"Refund created: {refund['id']} for transaction {transaction_id}")

            return {
                "refund_id": refund["id"],
                "status": refund["status"],
                "amount": str(refund_amount / 100)
            }

        except stripe.error.StripeAPIError as e:
            logger.error(f"Stripe refund error: {str(e)}")
            raise PaymentProcessingError(f"Refund failed: {str(e)}")
        except Exception as e:
            logger.error(f"Error processing refund: {str(e)}")
            raise PaymentProcessingError(f"Failed to process refund: {str(e)}")
