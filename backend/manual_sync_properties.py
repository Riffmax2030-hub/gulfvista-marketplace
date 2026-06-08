#!/usr/bin/env python
"""
Manual Property Sync Script
Immediately syncs properties from Reelly API to database.
Run this to populate properties without waiting for scheduled job.
"""

import asyncio
import sys
from dotenv import load_dotenv

# Load environment
load_dotenv()

from database import SessionLocal
from services.reelly_client import ReelyApiClient
from sync_reelly import PropertySyncService

async def manual_sync():
    """Manually sync properties from Reelly to database."""
    print("\n" + "="*80)
    print("🔄 MANUAL PROPERTY SYNC")
    print("="*80 + "\n")

    db = SessionLocal()

    try:
        sync_service = PropertySyncService(db)

        print("📥 Starting property sync from Reelly API...\n")

        # Connect to Reelly
        async with ReelyApiClient() as client:
            # Verify connection
            print("🔌 Verifying Reelly API connection...")
            if not await client.verify_connection():
                print("❌ Failed to connect to Reelly API")
                return False

            print("✅ Connected to Reelly API\n")

            # Fetch projects
            print("📤 Fetching projects from Reelly...")
            properties_list = []
            count = 0

            async for project in client.get_properties_paginated(limit=50):
                properties_list.append(project)
                count += 1
                if count % 10 == 0:
                    print(f"   Fetched {count} projects...")

            print(f"✅ Fetched {count} total projects\n")

            if not properties_list:
                print("⚠️  No projects found in Reelly")
                return False

            # Sync to database
            print("💾 Syncing to database...")

            created = 0
            updated = 0
            errors = 0

            for prop_data in properties_list:
                synced = sync_service.sync_property(prop_data)
                if synced:
                    created += 1
                else:
                    errors += 1

            db.commit()

            print(f"\n✅ Sync Complete!")
            print(f"   Created: {created} properties")
            print(f"   Updated: {updated} properties")
            print(f"   Errors: {errors}")

            # Verify
            from models import Property
            total = db.query(Property).count()
            print(f"\n📊 Total properties in database: {total}\n")

            return True

    except Exception as e:
        print(f"\n❌ Sync failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    try:
        success = asyncio.run(manual_sync())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⛔ Cancelled by user")
        sys.exit(1)
