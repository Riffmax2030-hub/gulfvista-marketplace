#!/usr/bin/env python
"""
Database Reset Script
Drops and recreates the gulfvista_dev database.
Use this when you have duplicate index errors or need a fresh database.
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()

import config

def reset_database():
    """Drop and recreate the gulfvista_dev database."""

    print("\n" + "="*70)
    print("🗑️  DATABASE RESET TOOL")
    print("="*70 + "\n")

    # Extract database name from DATABASE_URL
    db_url = config.DATABASE_URL
    db_name = db_url.split('/')[-1]

    # Create connection to postgres (default database)
    postgres_url = db_url.rsplit('/', 1)[0] + '/postgres'

    print(f"📋 Database to reset: {db_name}")
    print(f"🔗 Connecting to: postgres (system database)\n")

    try:
        # Connect to postgres database (admin database)
        engine = create_engine(postgres_url, isolation_level="AUTOCOMMIT")

        with engine.connect() as conn:
            print("✅ Connected to PostgreSQL\n")

            # Check if database exists
            print(f"🔍 Checking if '{db_name}' database exists...")
            result = conn.execute(
                text(f"""
                    SELECT 1 FROM pg_database WHERE datname = '{db_name}';
                """)
            )
            exists = result.fetchone() is not None

            if exists:
                print(f"   ✅ Found existing '{db_name}' database")
                print(f"   🗑️  Dropping database...\n")

                # Terminate all connections to the database
                conn.execute(text(f"""
                    SELECT pg_terminate_backend(pg_stat_activity.pid)
                    FROM pg_stat_activity
                    WHERE pg_stat_activity.datname = '{db_name}'
                    AND pid <> pg_backend_pid();
                """))

                # Drop the database
                conn.execute(text(f"DROP DATABASE {db_name};"))
                print(f"   ✅ Database '{db_name}' dropped successfully")
            else:
                print(f"   ℹ️  Database '{db_name}' does not exist (nothing to drop)")

            # Create fresh database
            print(f"\n📝 Creating fresh '{db_name}' database...")
            conn.execute(text(f"CREATE DATABASE {db_name};"))
            print(f"✅ Database '{db_name}' created successfully\n")

        print("="*70)
        print("✅ DATABASE RESET COMPLETE!")
        print("="*70)
        print("\n🚀 Next steps:")
        print("   1. Close this window")
        print("   2. Restart the server:")
        print("      python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        print("   3. Watch for: '✅ Backend fully initialized - All features active'")
        print("\n")
        return True

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("   1. Make sure PostgreSQL is running")
        print("   2. Check database credentials in .env")
        print("   3. Try using pgAdmin to drop the database manually")
        print("\n")
        return False

    finally:
        try:
            engine.dispose()
        except:
            pass

if __name__ == "__main__":
    success = reset_database()
    sys.exit(0 if success else 1)
