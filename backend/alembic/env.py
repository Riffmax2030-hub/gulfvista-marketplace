"""
Alembic migration environment configuration.
Handles all database migration setup and execution.
"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base
from models import (
    User, Property, Transaction, PropertySyncLog, AgentStats, ReelyWebhook,
    WebhookLog, Invoice, Lead
)

# Get the Alembic config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Get database URL from environment or config
database_url = os.getenv("DATABASE_URL=postgresql+psycopg://postgres:Iamgreat%402030@localhost:5432/gulfvista_dev")
config.set_main_option("sqlalchemy.url", database_url)

# Set target metadata for autogenerate
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    Useful for generating SQL scripts without running them directly.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.
    Creates a database engine and executes migrations against a live database.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

# DATABASE
DATABASE_URL=postgresql+psycopg://postgres:Iamgreat%402030@localhost:5432/gulfvista_dev

# REELLY API
REELLY_API_KEY=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfbmFtZSI6IkomTCBFbGVjdHJpY2FscyJ9.ST66NkxEMLWmffaUPW6Pj8S7h1rXUzigbzWipEi8t7TgKe7S4dwD5gdv8eADH8pYvFMGONdyHnyw_7cqCEsLPA
REELLY_BASE_URL=https://api.reelly.ai/v1
REELLY_WEBHOOK_SECRET=placeholder_for_development

# BACKGROUND JOBS
SCHEDULER_ENABLED=true
PROPERTY_SYNC_JOB_ENABLED=true
LEAD_NOTIFICATIONS_JOB_ENABLED=true
AGENT_STATS_JOB_ENABLED=true

# JWT
SECRET_KEY=dev-secret-key-change-in-production

# STRIPE (if you want it enabled)
STRIPE_SECRET_KEY=sk_test_dev
STRIPE_PUBLISHABLE_KEY=pk_test_devs