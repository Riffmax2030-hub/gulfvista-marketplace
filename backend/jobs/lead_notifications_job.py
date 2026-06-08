"""
Lead Notifications Job for gulfvista.properties.
Sends notifications to agents for pending leads.
"""

import logging
from datetime import datetime, UTC, timedelta
from database import SessionLocal
from sqlalchemy import and_, or_
from models import Lead, User, LeadStatus

logger = logging.getLogger(__name__)


def get_pending_leads_for_notification(db):
    """
    Get leads that need agent notifications.

    Criteria:
    - Status is NEW or CONTACTED
    - Not contacted in last 24 hours
    - Created more than 30 minutes ago

    Returns:
        List of Lead objects
    """
    thirty_min_ago = datetime.now(UTC) - timedelta(minutes=30)
    one_day_ago = datetime.now(UTC) - timedelta(days=1)

    leads = db.query(Lead).filter(
        Lead.status.in_([LeadStatus.NEW, LeadStatus.CONTACTED]),
        Lead.created_at < thirty_min_ago,
        or_(
            Lead.last_contacted_at.is_(None),
            Lead.last_contacted_at < one_day_ago
        )
    ).all()

    return leads


def send_agent_notification(agent: User, leads: list) -> bool:
    """
    Send notification to agent about pending leads.

    Args:
        agent: Agent User object
        leads: List of Lead objects

    Returns:
        True if notification sent successfully
    """
    try:
        # TODO: Implement actual email/notification sending
        # For now, just log the notification

        if not leads:
            return True

        logger.info(f"📧 Sending notification to {agent.email}")
        logger.info(f"   Agent: {agent.full_name}")
        logger.info(f"   Pending leads: {len(leads)}")

        for lead in leads:
            logger.info(f"   - Lead {lead.id}: {lead.inquirer_name} ({lead.inquirer_email})")

        # In a real implementation, you would:
        # 1. Build email template with lead details
        # 2. Send via SMTP or SendGrid
        # 3. Track email sending in database
        # 4. Handle bounces and failures

        return True

    except Exception as e:
        logger.error(f"Error sending notification to {agent.email}: {e}")
        return False


def run_lead_notifications():
    """
    Main job function to process and send lead notifications.
    Called by APScheduler every 5 minutes.
    """
    db = None

    logger.info("=" * 60)
    logger.info("🔔 LEAD NOTIFICATIONS JOB STARTING")
    logger.info(f"Time: {datetime.now(UTC).isoformat()}")
    logger.info("=" * 60)

    try:
        db = SessionLocal()

        # Get all pending leads
        pending_leads = get_pending_leads_for_notification(db)

        if not pending_leads:
            logger.info("✅ No pending leads requiring notification")
            return

        logger.info(f"📊 Found {len(pending_leads)} leads pending notification")

        # Group leads by agent
        leads_by_agent = {}
        for lead in pending_leads:
            agent_id = lead.agent_id
            if agent_id not in leads_by_agent:
                leads_by_agent[agent_id] = []
            leads_by_agent[agent_id].append(lead)

        # Send notifications to each agent
        notification_count = 0
        for agent_id, agent_leads in leads_by_agent.items():
            try:
                # Get agent details
                agent = db.query(User).filter(User.id == agent_id).first()
                if not agent:
                    logger.warning(f"Agent {agent_id} not found")
                    continue

                # Send notification
                if send_agent_notification(agent, agent_leads):
                    notification_count += 1
                    logger.info(f"✅ Notification sent to agent {agent_id}")

            except Exception as e:
                logger.error(f"Error notifying agent {agent_id}: {e}")

        logger.info(f"📊 Summary: {notification_count} notifications sent")
        logger.info("✅ Lead notifications job completed")

    except Exception as e:
        logger.error(f"❌ Lead notifications job failed: {e}")

    finally:
        if db:
            db.close()

    logger.info("=" * 60)


# Standalone execution (for testing)
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    run_lead_notifications()
