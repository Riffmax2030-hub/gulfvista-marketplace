"""
Configuration for gulfvista.properties backend.
"""
import os

# Database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:Iamgreat%402030@localhost:5432/gulfvista_dev"
)

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Stripe (development - optional)
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_dev")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "pk_test_dev")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_test_dev")
AGENT_REGISTRATION_PRICE_USD = 200

# Reelly API Integration (Phase 5) - v2.0
# Correct API Base: https://api-reelly.up.railway.app/api/v2/clients
REELLY_API_KEY = os.getenv("REELLY_API_KEY", "dev_key")
REELLY_BASE_URL = os.getenv("REELLY_BASE_URL", "https://api-reelly.up.railway.app/api/v2/clients")
REELLY_WEBHOOK_SECRET = os.getenv("REELLY_WEBHOOK_SECRET", "dev_webhook_secret")
REELLY_SYNC_INTERVAL_MINUTES = int(os.getenv("REELLY_SYNC_INTERVAL_MINUTES", "60"))
REELLY_BATCH_SIZE = int(os.getenv("REELLY_BATCH_SIZE", "50"))
REELLY_TIMEOUT_SECONDS = int(os.getenv("REELLY_TIMEOUT_SECONDS", "30"))
REELLY_MAX_RETRIES = int(os.getenv("REELLY_MAX_RETRIES", "3"))

# Background Jobs (Phase 5)
SCHEDULER_ENABLED = os.getenv("SCHEDULER_ENABLED", "true").lower() == "true"
PROPERTY_SYNC_JOB_ENABLED = os.getenv("PROPERTY_SYNC_JOB_ENABLED", "true").lower() == "true"
LEAD_NOTIFICATIONS_JOB_ENABLED = os.getenv("LEAD_NOTIFICATIONS_JOB_ENABLED", "true").lower() == "true"
AGENT_STATS_JOB_ENABLED = os.getenv("AGENT_STATS_JOB_ENABLED", "true").lower() == "true"

# Property Sync Settings
PROPERTY_SYNC_BATCH_SIZE = int(os.getenv("PROPERTY_SYNC_BATCH_SIZE", "50"))
PROPERTY_SYNC_TIMEOUT_SECONDS = int(os.getenv("PROPERTY_SYNC_TIMEOUT_SECONDS", "300"))
SYNC_FULL_REFRESH_DAYS = int(os.getenv("SYNC_FULL_REFRESH_DAYS", "7"))

# Lead Management Settings
LEAD_AUTO_ASSIGN_ENABLED = os.getenv("LEAD_AUTO_ASSIGN_ENABLED", "true").lower() == "true"
LEAD_NOTIFICATION_INTERVAL_MINUTES = int(os.getenv("LEAD_NOTIFICATION_INTERVAL_MINUTES", "5"))
LEAD_NOTIFICATION_THRESHOLD_MINUTES = int(os.getenv("LEAD_NOTIFICATION_THRESHOLD_MINUTES", "30"))
LEAD_FOLLOW_UP_REMINDER_HOURS = int(os.getenv("LEAD_FOLLOW_UP_REMINDER_HOURS", "24"))

# Agent Settings
AGENT_VERIFICATION_REQUIRED = os.getenv("AGENT_VERIFICATION_REQUIRED", "true").lower() == "true"
AGENT_STATS_RECALC_INTERVAL_HOURS = int(os.getenv("AGENT_STATS_RECALC_INTERVAL_HOURS", "24"))

# CORS
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "*",  # Allow all for development
]

# Server
SERVER_NAME = "gulfvista.properties"
SERVER_HOST = "0.0.0.0"
SERVER_PORT = 8000
DEBUG = False

# App
APP_NAME = "gulfvista Real Estate API"
API_V1_STR = "/api/v1"

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_FILE = os.getenv("LOG_FILE", "gulfvista.log")
LOG_TO_FILE = os.getenv("LOG_TO_FILE", "true").lower() == "true"

# Feature Flags
ENABLE_PROPERTY_SYNC = os.getenv("ENABLE_PROPERTY_SYNC", "true").lower() == "true"
ENABLE_LEAD_AUTO_ASSIGNMENT = os.getenv("ENABLE_LEAD_AUTO_ASSIGNMENT", "true").lower() == "true"
ENABLE_WEBHOOK_VERIFICATION = os.getenv("ENABLE_WEBHOOK_VERIFICATION", "true").lower() == "true"
ENABLE_AGENT_VERIFICATION_WORKFLOW = os.getenv("ENABLE_AGENT_VERIFICATION_WORKFLOW", "true").lower() == "true"
