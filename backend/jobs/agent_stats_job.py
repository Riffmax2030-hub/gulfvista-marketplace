"""
Agent Stats Update Job for gulfvista.properties.
Updates agent performance metrics daily.
"""

import logging
from datetime import datetime, UTC
from database import SessionLocal
from models import User, UserRole
from services import AgentService

logger = logging.getLogger(__name__)


def run_agent_stats_update():
    """
    Main job function to update all agent statistics.
    Called by APScheduler daily at 2:00 AM.

    Process:
    1. Get all verified agents
    2. Calculate stats for each agent
    3. Update performance metrics in database
    4. Generate summary report
    """
    db = None

    logger.info("=" * 60)
    logger.info("📊 AGENT STATS UPDATE JOB STARTING")
    logger.info(f"Time: {datetime.now(UTC).isoformat()}")
    logger.info("=" * 60)

    try:
        db = SessionLocal()
        agent_service = AgentService(db)

        # Get all verified agents
        verified_agents = db.query(User).filter(
            User.is_agent_verified == True,
            User.is_active == True,
        ).all()

        if not verified_agents:
            logger.info("ℹ️  No verified agents to update")
            return

        logger.info(f"📊 Updating stats for {len(verified_agents)} agents")

        # Update stats for each agent
        updated_count = 0
        error_count = 0

        for agent in verified_agents:
            try:
                stats = agent_service.calculate_agent_stats(agent.id)

                logger.info(
                    f"✅ Updated {agent.full_name} - "
                    f"Conversion: {stats.conversion_rate}% | "
                    f"Leads: {stats.total_leads} | "
                    f"Response Time: {stats.response_time_hours}h"
                )
                updated_count += 1

            except Exception as e:
                logger.error(f"❌ Error updating stats for agent {agent.id}: {e}")
                error_count += 1

        # Get network summary
        summary = agent_service.get_performance_summary()

        logger.info("=" * 60)
        logger.info("📈 AGENT NETWORK SUMMARY")
        logger.info("=" * 60)
        logger.info(f"Verified Agents: {summary['verified_agents']}")
        logger.info(f"Pending Agents: {summary['pending_agents']}")
        logger.info(f"Total Listings: {summary['total_listings']}")
        logger.info(f"Total Leads: {summary['total_leads']}")
        logger.info(f"Converted Leads: {summary['converted_leads']}")
        logger.info(f"Network Conversion Rate: {summary['network_conversion_rate']}%")
        logger.info("=" * 60)

        logger.info(f"✅ Agent stats update completed")
        logger.info(f"   Updated: {updated_count}")
        logger.info(f"   Errors: {error_count}")

    except Exception as e:
        logger.error(f"❌ Agent stats job failed: {e}")

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
    run_agent_stats_update()
