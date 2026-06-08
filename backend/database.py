"""
Database configuration and session management for gulfvista.properties.
Uses SQLAlchemy with PostgreSQL as the primary database.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import QueuePool
import config
from typing import Generator

# Create database engine with connection pooling
engine = create_engine(
    config.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Verify connections before using them
    echo=config.DEBUG,
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for all models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency injection for database sessions.
    Yields a SQLAlchemy session and ensures it's properly closed.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Initialize the database by creating all tables that don't exist.
    Should be called once on application startup.
    """
    from sqlalchemy import inspect
    import logging

    logger = logging.getLogger(__name__)

    try:
        logger.info("Initializing database schema...")

        # Create all tables (SQLAlchemy will skip tables that already exist)
        Base.metadata.create_all(bind=engine)

        # Verify tables were created
        inspector = inspect(engine)
        final_tables = inspector.get_table_names()
        logger.info(f"✅ Database schema initialized. Found {len(final_tables)} tables")

    except Exception as e:
        logger.error(f"❌ Database initialization error: {str(e)}")
        logger.error("If you see 'DuplicateTable' or 'DuplicateIndex' errors,")
        logger.error("run: python COMPLETE_FIX.py to reset the database completely")
        raise


@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """
    Set PostgreSQL query timeout for safety.
    Called when establishing a new database connection.
    """
    try:
        cursor = dbapi_conn.cursor()
        cursor.execute("SET statement_timeout TO 30000")  # 30 second query timeout
        cursor.close()
    except Exception:
        pass  # Ignore if timeout setting fails
