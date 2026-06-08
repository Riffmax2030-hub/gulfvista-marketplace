#!/usr/bin/env python
"""
Database migration utility script for gulfvista.properties.
Provides easy commands for database management.

Usage:
    python migrate.py upgrade       # Apply all pending migrations
    python migrate.py downgrade     # Rollback last migration
    python migrate.py current       # Show current migration status
    python migrate.py history       # Show migration history
    python migrate.py init          # Initialize database (development)
"""

import os
import sys
import subprocess
from pathlib import Path

# Get backend directory
BACKEND_DIR = Path(__file__).parent
os.chdir(BACKEND_DIR)


def run_command(command: list) -> int:
    """Run a shell command and return exit code."""
    try:
        # Use python -m alembic to avoid PATH issues on Windows
        if command[0] == "alembic":
            command = ["python", "-m"] + command
        result = subprocess.run(command, check=False)
        return result.returncode
    except Exception as e:
        print(f"❌ Error running command: {e}")
        return 1


def upgrade():
    """Apply all pending migrations."""
    print("🚀 Applying migrations...")
    return run_command(["alembic", "upgrade", "head"])


def downgrade():
    """Rollback last migration."""
    print("⬅️  Rolling back last migration...")
    return run_command(["alembic", "downgrade", "-1"])


def current():
    """Show current migration status."""
    print("📍 Current migration status:")
    return run_command(["alembic", "current"])


def history():
    """Show migration history."""
    print("📜 Migration history:")
    return run_command(["alembic", "history"])


def init_db():
    """Initialize database directly (development only)."""
    print("🔧 Initializing database...")
    try:
        from database import init_db as db_init
        db_init()
        print("✅ Database initialized successfully")
        return 0
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return 1


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    command = sys.argv[1].lower()

    commands = {
        "upgrade": upgrade,
        "up": upgrade,
        "downgrade": downgrade,
        "down": downgrade,
        "current": current,
        "status": current,
        "history": history,
        "init": init_db,
    }

    if command in commands:
        exit_code = commands[command]()
        sys.exit(exit_code)
    else:
        print(f"❌ Unknown command: {command}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
