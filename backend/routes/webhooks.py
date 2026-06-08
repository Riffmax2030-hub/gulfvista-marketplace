"""
Webhook endpoints for gulfvista.properties.
Handles inbound webhooks from Reelly API for real-time property updates.
"""

import logging
import hmac
import hashlib
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, UTC
from database import get_db
from models import ReelyWebhook
from schemas import ReelyWebhookPayload, ReelyWebhookResponse
from services import PropertySyncService
import config

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/webhooks")


def verify_reelly_signature(request_body: str, signature: str) -> bool:
    """
    Verify Reelly webhook signature for authenticity.

    Args:
        request_body: Raw request body as string
        signature: X-Reelly-Signature header value

    Returns:
        True if signature is valid, False otherwise
    """
    if not config.REELLY_WEBHOOK_SECRET:
        logger.warning("⚠️  REELLY_WEBHOOK_SECRET not configured, skipping verification")
        return True

    expected_signature = hmac.new(
        config.REELLY_WEBHOOK_SECRET.encode(),
        request_body.encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected_signature)


# ============================================================================
# Reelly Webhook Handler
# ============================================================================

@router.post("/reelly", response_model=ReelyWebhookResponse)
async def handle_reelly_webhook(
    payload: ReelyWebhookPayload,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Handle inbound webhook from Reelly API.

    Events:
    - property.created: New property added
    - property.updated: Property details changed
    - property.deleted: Property removed

    Webhook Signature Verification:
    - Reelly sends X-Reelly-Signature header
    - Computed using HMAC-SHA256 with webhook secret
    """
    try:
        # Get signature from header
        signature = request.headers.get("X-Reelly-Signature", "")

        # Verify signature (optional, based on configuration)
        # Note: In production, always verify signatures
        if config.REELLY_WEBHOOK_SECRET:
            body = await request.body()
            if not verify_reelly_signature(body.decode(), signature):
                logger.error(f"❌ Invalid webhook signature for event {payload.event_id}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid webhook signature"
                )

        # Log webhook receipt
        webhook = ReelyWebhook(
            reely_event_id=payload.event_id,
            event_type=payload.event_type,
            payload=payload.data,
            processed=False,
        )
        db.add(webhook)
        db.flush()

        logger.info(f"📥 Received Reelly webhook: {payload.event_type} ({payload.event_id})")

        # Process based on event type
        if payload.event_type == "property.created":
            handle_property_created(payload, db)

        elif payload.event_type == "property.updated":
            handle_property_updated(payload, db)

        elif payload.event_type == "property.deleted":
            handle_property_deleted(payload, db)

        else:
            logger.warning(f"⚠️  Unknown event type: {payload.event_type}")

        # Mark as processed
        webhook.processed = True
        webhook.processed_at = datetime.now(UTC)
        db.commit()

        logger.info(f"✅ Processed webhook {payload.event_id}")

        return {
            "status": "accepted",
            "message": f"Webhook {payload.event_type} processed",
            "event_id": payload.event_id,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error processing webhook: {e}")

        # Mark as failed if webhook exists
        try:
            webhook = db.query(ReelyWebhook).filter(
                ReelyWebhook.reely_event_id == payload.event_id
            ).first()
            if webhook:
                webhook.processed = False
                webhook.error_details = str(e)
                webhook.processed_at = datetime.now(UTC)
                db.commit()
        except:
            pass

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process webhook: {str(e)}"
        )


def handle_property_created(payload: ReelyWebhookPayload, db: Session):
    """Handle property.created event."""
    try:
        property_data = payload.data
        property_id = property_data.get("id")

        if not property_id:
            logger.warning("Property created event missing ID")
            return

        sync_service = PropertySyncService(db)
        prop, is_new = sync_service.get_or_create_property(
            property_data,
            source_id=property_id,
            source_platform="reelly"
        )

        if is_new:
            logger.info(f"🆕 Created property from webhook: {property_id}")
        else:
            logger.info(f"📝 Updated property from webhook: {property_id}")

    except Exception as e:
        logger.error(f"Error handling property.created: {e}")


def handle_property_updated(payload: ReelyWebhookPayload, db: Session):
    """Handle property.updated event."""
    try:
        property_data = payload.data
        property_id = property_data.get("id")

        if not property_id:
            logger.warning("Property updated event missing ID")
            return

        sync_service = PropertySyncService(db)
        prop, is_new = sync_service.get_or_create_property(
            property_data,
            source_id=property_id,
            source_platform="reelly"
        )

        if not is_new:
            # Update property
            changed = sync_service.update_property(prop, property_data)
            if changed:
                logger.info(f"📝 Updated property: {property_id}")
            else:
                logger.info(f"⏭️  No changes for property: {property_id}")

    except Exception as e:
        logger.error(f"Error handling property.updated: {e}")


def handle_property_deleted(payload: ReelyWebhookPayload, db: Session):
    """Handle property.deleted event."""
    try:
        property_data = payload.data
        property_id = property_data.get("id")

        if not property_id:
            logger.warning("Property deleted event missing ID")
            return

        sync_service = PropertySyncService(db)
        sync_service.handle_deleted_properties([property_id])

        logger.info(f"🗑️  Marked property as deleted: {property_id}")

    except Exception as e:
        logger.error(f"Error handling property.deleted: {e}")


# ============================================================================
# Webhook Management (Admin Only)
# ============================================================================

@router.get("/reelly/recent")
async def get_recent_webhooks(
    limit: int = 20,
    db: Session = Depends(get_db),
):
    """Get recent Reelly webhooks received."""
    try:
        webhooks = db.query(ReelyWebhook).order_by(
            ReelyWebhook.received_at.desc()
        ).limit(limit).all()

        return {
            "webhooks": [
                {
                    "id": w.id,
                    "event_id": w.reely_event_id,
                    "event_type": w.event_type,
                    "processed": w.processed,
                    "received_at": w.received_at.isoformat(),
                    "processed_at": w.processed_at.isoformat() if w.processed_at else None,
                    "error": w.error_details,
                }
                for w in webhooks
            ]
        }

    except Exception as e:
        logger.error(f"Error fetching webhooks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/reelly/stats")
async def get_webhook_stats(
    db: Session = Depends(get_db),
):
    """Get webhook statistics."""
    try:
        total = db.query(ReelyWebhook).count()
        processed = db.query(ReelyWebhook).filter(ReelyWebhook.processed == True).count()
        failed = db.query(ReelyWebhook).filter(
            (ReelyWebhook.processed == False) & (ReelyWebhook.error_details.isnot(None))
        ).count()

        return {
            "total_webhooks": total,
            "processed": processed,
            "failed": failed,
            "success_rate": (processed / total * 100) if total > 0 else 0,
        }

    except Exception as e:
        logger.error(f"Error fetching webhook stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
