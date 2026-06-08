"""
Property Sync Job for gulfvista.properties.
Runs periodically to sync properties from Reelly API.
"""

import logging
import asyncio
from datetime import datetime, UTC
from database import SessionLocal
from services import ReelyApiClient, PropertySyncService

logger = logging.getLogger(__name__)


async def async_sync_properties():
    """
    Async function to fetch and sync properties from Reelly API.

    Process:
    1. Connect to Reelly API
    2. Fetch properties with pagination
    3. Sync to local database with deduplication
    4. Log the sync operation
    5. Update AgentStats
    """
    db = None
    sync_log = None

    try:
        db = SessionLocal()
        sync_service = PropertySyncService(db)

        logger.info("🚀 Starting property sync from Reelly API")
        sync_service.log_sync(
            sync_type="incremental",
            status="in_progress",
            stats={"total_processed": 0},
        )

        # Connect to Reelly API
        async with ReelyApiClient() as client:
            # Verify connection first
            if not await client.verify_connection():
                raise Exception("Failed to connect to Reelly API")

            logger.info("✅ Connected to Reelly API")

            # Fetch properties with pagination
            properties_list = []
            try:
                async for prop in client.get_properties_paginated(limit=100):
                    properties_list.append(prop)

                    # Sync in batches of 50 to avoid memory issues
                    if len(properties_list) >= 50:
                        stats = sync_service.sync_properties(
                            properties_list,
                            sync_type="incremental"
                        )
                        logger.info(f"📦 Synced batch of 50 properties: {stats}")
                        properties_list = []

            except Exception as e:
                logger.error(f"❌ Error fetching properties: {e}")

        # Sync remaining properties
        if properties_list:
            stats = sync_service.sync_properties(
                properties_list,
                sync_type="incremental"
            )
            logger.info(f"📦 Synced final batch: {stats}")

        # Log successful sync
        final_stats = sync_service.get_sync_status()
        sync_log = sync_service.log_sync(
            sync_type="incremental",
            status="completed",
            stats=final_stats,
        )

        logger.info(f"✅ Property sync completed successfully")
        logger.info(f"📊 Sync stats: {final_stats}")

        return True

    except Exception as e:
        logger.error(f"❌ Property sync failed: {e}")

        # Log failed sync
        if db:
            try:
                sync_service = PropertySyncService(db)
                sync_service.log_sync(
                    sync_type="incremental",
                    status="failed",
                    stats={"total_processed": 0, "error_count": 1},
                    error_details=str(e),
                )
            except Exception as log_error:
                logger.error(f"Failed to log sync error: {log_error}")

        return False

    finally:
        if db:
            db.close()


def run_property_sync():
    """
    Wrapper function to run async property sync job.
    Called by APScheduler.
    """
    logger.info("=" * 60)
    logger.info("🔄 PROPERTY SYNC JOB STARTING")
    logger.info(f"Time: {datetime.now(UTC).isoformat()}")
    logger.info("=" * 60)

    try:
        # Run async function
        success = asyncio.run(async_sync_properties())

        if success:
            logger.info("✅ Property sync job completed successfully")
        else:
            logger.error("❌ Property sync job failed")

    except Exception as e:
        logger.error(f"❌ Unexpected error in property sync job: {e}")

    logger.info("=" * 60)


# Standalone execution (for testing)
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    run_property_sync()
