#!/usr/bin/env python
"""
Database Table Verification Script
Verifies that all required tables were created after the fix.
Run this after restarting the server to confirm the database fix worked.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

import config
from database import engine
from sqlalchemy import inspect, text

def main():
    """Verify all required database tables exist."""

    print("\n" + "="*70)
    print("🔍 GULFVISTA DATABASE TABLE VERIFICATION")
    print("="*70 + "\n")

    # Required tables for Phase 5 system
    REQUIRED_TABLES = {
        'users': 'User accounts (core)',
        'properties': 'Property listings',
        'leads': 'Property leads',
        'agents': 'Agent information',
        'agent_stats': 'Agent statistics',
        'property_sync_logs': 'Reelly sync operation logs',
        'reely_webhooks': 'Reelly webhook events',
        'webhook_logs': 'Webhook operation logs',
    }

    try:
        # Connect to database
        print(f"📦 Database: {config.DATABASE_URL.split('/')[-1]}")
        print(f"🔐 Host: {config.DATABASE_URL.split('@')[1].split(':')[0] if '@' in config.DATABASE_URL else 'localhost'}\n")

        # Get table inspector
        inspector = inspect(engine)
        existing_tables = set(inspector.get_table_names())

        print(f"Found {len(existing_tables)} total tables in database\n")

        # Check required tables
        missing_tables = []
        found_tables = []

        for table_name, description in REQUIRED_TABLES.items():
            if table_name in existing_tables:
                found_tables.append((table_name, description))
                print(f"✅ {table_name:25} - {description}")
            else:
                missing_tables.append((table_name, description))
                print(f"❌ {table_name:25} - {description} [MISSING!]")

        print("\n" + "="*70)

        # Summary
        success_rate = len(found_tables) / len(REQUIRED_TABLES) * 100

        if missing_tables:
            print(f"⚠️  INCOMPLETE: {len(found_tables)}/{len(REQUIRED_TABLES)} required tables found ({success_rate:.0f}%)")
            print("\n❌ Missing tables:")
            for table_name, description in missing_tables:
                print(f"   - {table_name}")
            print("\n🔧 SOLUTION:")
            print("   1. Stop the server (Ctrl+C)")
            print("   2. Delete and recreate the database:")
            print("      psql -U postgres")
            print("      DROP DATABASE gulfvista_dev;")
            print("      CREATE DATABASE gulfvista_dev;")
            print("      \\q")
            print("   3. Restart the server")
            print("   4. Re-run this script")
            return False
        else:
            print(f"✅ SUCCESS: All {len(REQUIRED_TABLES)} required tables found!")
            print("\n📊 Additional tables found:")
            for table_name in existing_tables:
                if table_name not in REQUIRED_TABLES:
                    print(f"   - {table_name}")
            return True

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("\nPossible causes:")
        print("  1. PostgreSQL is not running")
        print("  2. Database credentials in .env are incorrect")
        print("  3. Database 'gulfvista_dev' does not exist")
        print("\n🔧 Troubleshooting:")
        print("  1. Check PostgreSQL is running")
        print("  2. Verify .env DATABASE_URL: ", config.DATABASE_URL[:50] + "...")
        print("  3. Test connection with: psql -U postgres -d gulfvista_dev")
        return False

    finally:
        print("\n" + "="*70 + "\n")

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
