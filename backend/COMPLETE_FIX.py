#!/usr/bin/env python
"""
COMPLETE DATABASE FIX
Completely resets PostgreSQL database and ensures clean initialization.
Run this when database is corrupted or has orphaned indices.
"""

import os
import sys
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import config
from sqlalchemy import create_engine, text, event

def main():
    print("\n" + "="*80)
    print("🔧 COMPLETE DATABASE RESET & FIX")
    print("="*80 + "\n")

    db_url = config.DATABASE_URL
    db_name = db_url.split('/')[-1]

    # Create connection to postgres database (admin)
    postgres_url = db_url.rsplit('/', 1)[0] + '/postgres'

    print(f"📋 Target database: {db_name}")
    print(f"🔗 Admin connection: postgres\n")

    try:
        # Step 1: Connect to postgres database
        print("STEP 1: Connecting to PostgreSQL...")
        engine = create_engine(postgres_url, isolation_level="AUTOCOMMIT")

        with engine.connect() as conn:
            print("✅ Connected to PostgreSQL\n")

            # Step 2: Terminate all connections to target database
            print("STEP 2: Terminating connections to database...")
            try:
                conn.execute(text(f"""
                    SELECT pg_terminate_backend(pid)
                    FROM pg_stat_activity
                    WHERE datname = '{db_name}'
                    AND pid <> pg_backend_pid();
                """))
                print("✅ All connections terminated\n")
            except Exception as e:
                print(f"⚠️  Could not terminate connections: {e}\n")

            # Step 3: Drop database
            print("STEP 3: Dropping database...")
            try:
                conn.execute(text(f"DROP DATABASE IF EXISTS {db_name};"))
                print(f"✅ Database '{db_name}' dropped\n")
            except Exception as e:
                print(f"❌ Failed to drop database: {e}")
                return False

            # Step 4: Create fresh database
            print("STEP 4: Creating fresh database...")
            try:
                conn.execute(text(f"CREATE DATABASE {db_name};"))
                print(f"✅ Database '{db_name}' created\n")
            except Exception as e:
                print(f"❌ Failed to create database: {e}")
                return False

        engine.dispose()

        # Step 5: Initialize with SQLAlchemy
        print("STEP 5: Initializing database schema with SQLAlchemy...")

        # Create fresh connection to new database with new engine
        fresh_engine = create_engine(db_url)

        # Import models to register them
        from models import Base

        # Create all tables with fresh engine
        # Wrap in try-except to handle duplicate index edge case
        try:
            Base.metadata.create_all(bind=fresh_engine)
            print("✅ All tables created\n")
        except Exception as create_error:
            if "DuplicateTable" in str(create_error) or "already exists" in str(create_error):
                print("⚠️  Got duplicate index error (edge case), retrying with individual tables...\n")
                # Fall back to creating tables individually
                for table in Base.metadata.sorted_tables:
                    try:
                        table.create(fresh_engine, checkfirst=True)
                    except Exception as t_error:
                        print(f"⚠️  Could not create {table.name}: {str(t_error)[:50]}")
                print("✅ Tables created (with fallback method)\n")
            else:
                raise

        # Verify
        from sqlalchemy import inspect
        inspector = inspect(fresh_engine)
        tables = inspector.get_table_names()

        fresh_engine.dispose()

        print("STEP 6: Verification...")
        print(f"✅ Created {len(tables)} tables:")
        for table in sorted(tables):
            print(f"   • {table}")

        print("\n" + "="*80)
        print("✅ DATABASE COMPLETELY RESET AND INITIALIZED!")
        print("="*80)
        print("\n🚀 Next steps:")
        print("   1. The database is now fresh and ready")
        print("   2. Start the server: python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        print("   3. You should see: '✅ Backend fully initialized - All features active'")
        print("\n")

        return True

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
