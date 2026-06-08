"""
Payment and Stripe webhook endpoints for the gulfvista.properties API.
"""

import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, UTC

from database import get_db
from auth import get_current_user
from models import User, Transaction, PaymentStatus
from payments.service import (
    StripePaymentService,
    WebhookVerificationError,
    PaymentProcessingError
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/payments", tags=["payments"])


# ============================================================================
# Pydantic Models for Request/Response
# ============================================================================

class CreateCheckoutSessionRequest(BaseModel):
    """Request to create a checkout session."""
    transaction_type: str = "agent_registration"  # Type of transaction
    amount_cents: int  # Amount in cents
    success_url: str
    cancel_url: str


class CheckoutSessionResponse(BaseModel):
    """Response containing checkout session details."""
    session_id: str
    checkout_url: str
    transaction_id: str


class PaymentStatusResponse(BaseModel):
    """Response containing payment status."""
    status: str
    payment_status: str
    session_id: str
    amount: Optional[int] = None
    currency: Optional[str] = None


class TransactionResponse(BaseModel):
    """Response containing transaction details."""
    id: int
    user_id: int
    stripe_session_id: str
    amount_cents: int
    currency: str
    transaction_type: str
    description: str
    status: str
    completed_at: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True


class TransactionListResponse(BaseModel):
    """Response containing list of transactions."""
    items: list[TransactionResponse]
    total: int
    page: int
    page_size: int


class RefundRequest(BaseModel):
    """Request to refund a transaction."""
    amount_cents: Optional[int] = None  # None for full refund


class RefundResponse(BaseModel):
    """Response containing refund details."""
    refund_id: str
    status: str
    amount: str


# ============================================================================
# Endpoints
# ============================================================================

@router.post("/create-checkout-session", response_model=CheckoutSessionResponse)
def create_checkout_session(
    request: CreateCheckoutSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a Stripe checkout session for payment.

    **Authentication**: Required (current user)

    **Body**:
    - `transaction_type`: Type of transaction (default: "agent_registration")
    - `amount_cents`: Amount in cents (e.g., 20000 for $200)
    - `success_url`: URL to redirect to after successful payment
    - `cancel_url`: URL to redirect to if payment is cancelled

    **Returns**: Checkout session details with URL

    **Example**:
    ```
    POST /api/v1/payments/create-checkout-session
    {
        "transaction_type": "agent_registration",
        "amount_cents": 20000,
        "success_url": "https://yourdomain.com/payment-success",
        "cancel_url": "https://yourdomain.com/payment-cancelled"
    }
    ```
    """
    try:
        # Validate amount
        if request.amount_cents <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Amount must be greater than 0"
            )

        # Create checkout session
        result = StripePaymentService.create_checkout_session(
            user_id=current_user.id,
            amount_cents=request.amount_cents,
            transaction_type=request.transaction_type,
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            db=db
        )

        return CheckoutSessionResponse(**result)

    except PaymentProcessingError as e:
        logger.error(f"Payment processing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create checkout session"
        )
    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/session/{session_id}", response_model=PaymentStatusResponse)
def get_session_status(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the status of a Stripe checkout session.

    **Authentication**: Required

    **Parameters**:
    - `session_id`: Stripe checkout session ID

    **Returns**: Session status and payment details

    **Example**:
    ```
    GET /api/v1/payments/session/cs_test_abc123
    ```
    """
    try:
        # Verify session belongs to current user (check from Transaction)
        transaction = db.query(Transaction).filter(
            Transaction.stripe_session_id == session_id,
            Transaction.user_id == current_user.id
        ).first()

        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Get status from Stripe
        status_data = StripePaymentService.get_session_status(session_id)
        return PaymentStatusResponse(**status_data)

    except PaymentProcessingError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve session status"
        )


@router.get("/transactions", response_model=TransactionListResponse)
def get_transactions(
    skip: int = 0,
    limit: int = 10,
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's transactions with pagination and optional filtering.

    **Authentication**: Required

    **Query Parameters**:
    - `skip`: Number of records to skip (default: 0)
    - `limit`: Number of records to return (default: 10)
    - `status_filter`: Filter by status (pending, completed, failed, refunded)

    **Returns**: Paginated list of transactions

    **Example**:
    ```
    GET /api/v1/payments/transactions?skip=0&limit=10&status_filter=completed
    ```
    """
    try:
        query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

        # Apply status filter if provided
        if status_filter:
            try:
                status_enum = PaymentStatus(status_filter.lower())
                query = query.filter(Transaction.status == status_enum)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status: {status_filter}"
                )

        # Get total count
        total = query.count()

        # Apply pagination
        transactions = query.order_by(Transaction.created_at.desc()).offset(skip).limit(limit).all()

        # Convert to response format
        items = [
            TransactionResponse(
                id=t.id,
                user_id=t.user_id,
                stripe_session_id=t.stripe_session_id,
                amount_cents=t.amount_cents,
                currency=t.currency,
                transaction_type=t.transaction_type,
                description=t.description,
                status=t.status.value,
                completed_at=t.completed_at.isoformat() if t.completed_at else None,
                created_at=t.created_at.isoformat()
            )
            for t in transactions
        ]

        return TransactionListResponse(
            items=items,
            total=total,
            page=skip // limit + 1,
            page_size=limit
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch transactions"
        )


@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction_detail(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get details of a specific transaction.

    **Authentication**: Required

    **Parameters**:
    - `transaction_id`: ID of the transaction

    **Returns**: Transaction details

    **Example**:
    ```
    GET /api/v1/payments/transactions/123
    ```
    """
    try:
        transaction = db.query(Transaction).filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id
        ).first()

        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )

        return TransactionResponse(
            id=transaction.id,
            user_id=transaction.user_id,
            stripe_session_id=transaction.stripe_session_id,
            amount_cents=transaction.amount_cents,
            currency=transaction.currency,
            transaction_type=transaction.transaction_type,
            description=transaction.description,
            status=transaction.status.value,
            completed_at=transaction.completed_at.isoformat() if transaction.completed_at else None,
            created_at=transaction.created_at.isoformat()
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching transaction detail: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch transaction"
        )


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Stripe webhook endpoint for payment event notifications.

    **Authentication**: Not required (Stripe webhook)

    **Events Handled**:
    - `checkout.session.completed`: Payment successful
    - `payment_intent.payment_failed`: Payment failed
    - `charge.refunded`: Refund processed

    **Notes**:
    - Webhook signature is verified using Stripe webhook secret
    - Returns 200 immediately for idempotency
    - Processes event asynchronously
    """
    try:
        # Get raw request body
        body = await request.body()
        signature_header = request.headers.get("stripe-signature", "")

        # Verify webhook signature
        try:
            event = StripePaymentService.verify_webhook_signature(
                request_body=body.decode("utf-8"),
                signature_header=signature_header
            )
        except WebhookVerificationError as e:
            logger.warning(f"Webhook verification failed: {str(e)}")
            # Still return 200 to avoid Stripe retrying
            return {"status": "ok"}

        # Log webhook event
        event_id = event.get("id")
        event_type = event.get("type")
        StripePaymentService.log_webhook(event_id, event_type, event, db)

        # Handle different event types
        if event_type == "checkout.session.completed":
            try:
                transaction = StripePaymentService.process_webhook_payment_completed(event, db)
                logger.info(f"Payment completed: {transaction.id if transaction else 'unknown'}")
                # TODO: Send confirmation email
            except PaymentProcessingError as e:
                logger.error(f"Error processing payment completion: {str(e)}")
                StripePaymentService.log_webhook(
                    event_id, event_type, event, db,
                    error_details=str(e)
                )

        elif event_type == "payment_intent.payment_failed":
            try:
                transaction = StripePaymentService.process_webhook_payment_failed(event, db)
                logger.warning(f"Payment failed: {transaction.id if transaction else 'unknown'}")
                # TODO: Send failure notification email
            except PaymentProcessingError as e:
                logger.error(f"Error processing payment failure: {str(e)}")

        elif event_type == "charge.refunded":
            logger.info(f"Refund processed: {event['data']['object']['id']}")
            # TODO: Handle refund event

        else:
            logger.debug(f"Unhandled webhook event: {event_type}")

        # Always return 200 for idempotency (don't repeat on retry)
        return {"status": "ok"}

    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}")
        # Return 200 to avoid Stripe retrying
        return {"status": "ok"}


@router.post("/refund/{transaction_id}", response_model=RefundResponse)
def refund_transaction(
    transaction_id: int,
    request: RefundRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Refund a transaction (admin only).

    **Authentication**: Required + Admin role

    **Parameters**:
    - `transaction_id`: ID of the transaction to refund

    **Body**:
    - `amount_cents`: Optional - amount to refund (None for full refund)

    **Returns**: Refund details

    **Example**:
    ```
    POST /api/v1/payments/refund/123
    {
        "amount_cents": null
    }
    ```
    """
    # Check if user is admin
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can process refunds"
        )

    try:
        result = StripePaymentService.refund_transaction(
            transaction_id=transaction_id,
            amount_cents=request.amount_cents,
            db=db
        )

        return RefundResponse(**result)

    except PaymentProcessingError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error processing refund: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process refund"
        )
