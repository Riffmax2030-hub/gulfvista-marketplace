"""
Background jobs module for gulfvista.properties.
Contains scheduled tasks for property sync, notifications, and stats updates.
"""

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
import logging

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = None


def init_scheduler():
    """
    Initialize and start the background job scheduler.
    Should be called on application startup.
    """
    global scheduler

    if scheduler is not None:
        logger.warning("Scheduler already initialized")
        return scheduler

    scheduler = BackgroundScheduler()

    # Import job functions
    from .property_sync_job import run_property_sync
    from .lead_notifications_job import run_lead_notifications
    from .agent_stats_job import run_agent_stats_update

    # Schedule property sync - every 60 minutes
    scheduler.add_job(
        run_property_sync,
        trigger=IntervalTrigger(minutes=60),
        id="property_sync_job",
        name="Property Sync from Reelly",
        replace_existing=True,
        coalesce=True,
        max_instances=1,
    )
    logger.info("📅 Scheduled: Property Sync (every 60 minutes)")

    # Schedule lead notifications - every 5 minutes
    scheduler.add_job(
        run_lead_notifications,
        trigger=IntervalTrigger(minutes=5),
        id="lead_notifications_job",
        name="Lead Notifications",
        replace_existing=True,
        coalesce=True,
        max_instances=1,
    )
    logger.info("📅 Scheduled: Lead Notifications (every 5 minutes)")

    # Schedule agent stats update - daily at 2 AM
    scheduler.add_job(
        run_agent_stats_update,
        trigger=CronTrigger(hour=2, minute=0),
        id="agent_stats_job",
        name="Agent Stats Update",
        replace_existing=True,
        coalesce=True,
        max_instances=1,
    )
    logger.info("📅 Scheduled: Agent Stats Update (daily at 2:00 AM)")

    # Start scheduler
    scheduler.start()
    logger.info("✅ Background job scheduler started")

    return scheduler


def get_scheduler():
    """
    Get the scheduler instance.
    Returns None if not initialized.
    """
    return scheduler


def stop_scheduler():
    """
    Stop the background job scheduler.
    Should be called on application shutdown.
    """
    global scheduler

    if scheduler and scheduler.running:
        scheduler.shutdown()
        logger.info("⛔ Background job scheduler stopped")
        scheduler = None


def get_job_status():
    """
    Get status of all scheduled jobs.

    Returns:
        Dictionary with job statuses
    """
    if not scheduler:
        return {"status": "not_initialized"}

    jobs_status = {
        "scheduler_running": scheduler.running,
        "jobs": [],
    }

    for job in scheduler.get_jobs():
        jobs_status["jobs"].append({
            "id": job.id,
            "name": job.name,
            "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None,
            "trigger": str(job.trigger),
        })

    return jobs_status


__all__ = [
    "init_scheduler",
    "get_scheduler",
    "stop_scheduler",
    "get_job_status",
]
