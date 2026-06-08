# Phase 5 Integration Guide
## Reelly API Integration & Lead Management

**Status**: ✅ Complete and Production-Ready  
**Date**: May 20, 2026  
**Version**: 5.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Initialization](#database-initialization)
5. [Startup Verification](#startup-verification)
6. [API Integration](#api-integration)
7. [Background Jobs](#background-jobs)
8. [Testing & Validation](#testing--validation)
9. [Troubleshooting](#troubleshooting)
10. [Production Deployment](#production-deployment)

---

## Overview

Phase 5 brings comprehensive Reelly API integration and intelligent lead management to gulfvista.properties:

### Key Features

**🔄 Property Synchronization**
- Real-time sync with Reelly API
- Automatic webhook handling
- Deduplication using source_id
- Batch processing for efficiency

**🎯 Lead Management**
- Auto-assignment to agents (round-robin)
- Communication logging
- Conversion tracking
- Status management

**📊 Agent Analytics**
- Real-time performance metrics
- Conversion rate tracking
- Response time monitoring
- Network-wide statistics

**🔔 Background Jobs**
- Property sync (hourly)
- Lead notifications (every 5 minutes)
- Agent stats (daily at 2:00 AM)

**🔐 Webhook Integration**
- HMAC-SHA256 signature verification
- Event deduplication
- Error handling & retry logic

---

## Installation & Setup

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- Docker (optional, for PostgreSQL)

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Configuration](#environment-configuration) below).

### Step 3: Initialize Database

```bash
# Run migrations
python -m alembic upgrade head

# Create admin user (interactive)
python -c "from database import init_db; init_db()"
```

---

## Environment Configuration

### Database

```env
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/gulfvista_dev
```

### Reelly API

Get these from your Reelly dashboard (https://dashboard.reelly.io):

```env
# API Key for authentication
REELLY_API_KEY=your_api_key_here

# API Base URL
REELLY_BASE_URL=https://api.reelly.io/v1

# Webhook secret for signature verification
REELLY_WEBHOOK_SECRET=your_webhook_secret_here

# Sync configuration
REELLY_SYNC_INTERVAL_MINUTES=60         # Sync every hour
REELLY_BATCH_SIZE=50                     # Process 50 properties per batch
REELLY_TIMEOUT_SECONDS=30               # API timeout
REELLY_MAX_RETRIES=3                     # Retry failed requests
```

### Background Jobs

```env
# Enable/disable scheduler
SCHEDULER_ENABLED=true

# Individual job toggles
PROPERTY_SYNC_JOB_ENABLED=true
LEAD_NOTIFICATIONS_JOB_ENABLED=true
AGENT_STATS_JOB_ENABLED=true

# Lead notification settings
LEAD_NOTIFICATION_INTERVAL_MINUTES=5    # Check every 5 minutes
LEAD_NOTIFICATION_THRESHOLD_MINUTES=30  # Notify about leads 30+ min old

# Full sync refresh interval
SYNC_FULL_REFRESH_DAYS=7                # Full sync every 7 days
```

### Security

```env
# JWT Secret (change in production!)
SECRET_KEY=your-super-secret-key-here

# Stripe integration (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Features

```env
# Enable/disable features
ENABLE_PROPERTY_SYNC=true
ENABLE_LEAD_AUTO_ASSIGNMENT=true
ENABLE_WEBHOOK_VERIFICATION=true
ENABLE_AGENT_VERIFICATION_WORKFLOW=true
```

---

## Database Initialization

### Initial Setup

```bash
# Create all tables
python -m alembic upgrade head

# Verify migrations
python -m alembic current
```

### Seed Data (Optional)

```python
# Create sample agents and properties
python
>>> from database import SessionLocal
>>> from models import User, UserRole, Property
>>> db = SessionLocal()
>>> 
>>> # Create sample agent
>>> agent = User(
...     email="agent@example.ae",
...     full_name="Fatima Al-Maktoum",
...     role=UserRole.AGENT_ADMIN,
...     is_agent_verified=True,
...     is_active=True
... )
>>> db.add(agent)
>>> db.commit()
```

---

## Startup Verification

### Run Verification Script

```bash
python verify_startup.py
```

This script checks:
- ✅ All Python imports
- ✅ Configuration loading
- ✅ Database connection
- ✅ Model definitions
- ✅ Service availability
- ✅ API routes registration
- ✅ Background job scheduler
- ✅ Reelly API connection
- ✅ Authentication module

### Expected Output

```
╔══════════════════════════════════════════════════════════════════╗
║ gulfvista.properties - Phase 5 Startup Verification              ║
║ Started: 2026-05-20 14:30:45                                     ║
╚══════════════════════════════════════════════════════════════════╝

1. VERIFYING IMPORTS
✅ FastAPI import OK
✅ SQLAlchemy import OK
...

STARTUP VERIFICATION REPORT
═══════════════════════════════════════════════════════════════════

PASSED (35):
  ✅ FastAPI import OK
  ✅ Configuration loaded
  ...

SUMMARY:
  Total Checks: 35
  Passed: 35
  Failed: 0
  Warnings: 0
  Time: 2.34s

✅ STARTUP VERIFICATION PASSED
```

---

## API Integration

### Start the Backend Server

```bash
# Development
python -m uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Access API Documentation

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json

### Health Check

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "gulfvista Real Estate API",
  "version": "2.0.0",
  "phase": "Phase 2: Backend Features"
}
```

---

## Background Jobs

### APScheduler Configuration

Jobs are automatically initialized on application startup:

```python
# From jobs/__init__.py
init_scheduler()  # Called in main.py startup event
```

### Job Schedules

| Job | Schedule | Purpose |
|-----|----------|---------|
| `property_sync_job` | Every 60 min | Sync properties from Reelly |
| `lead_notifications_job` | Every 5 min | Send agent notifications |
| `agent_stats_job` | Daily 2:00 AM | Update performance stats |

### Monitor Jobs

```bash
# Get job status
curl http://localhost:8000/api/v1/jobs/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "status": "running",
  "jobs": [
    {
      "name": "property_sync_job",
      "next_run": "2026-05-20T15:30:00",
      "status": "scheduled"
    },
    ...
  ]
}
```

### Disable Jobs

Set in `.env`:

```env
SCHEDULER_ENABLED=false
# OR individually:
PROPERTY_SYNC_JOB_ENABLED=false
LEAD_NOTIFICATIONS_JOB_ENABLED=false
AGENT_STATS_JOB_ENABLED=false
```

---

## Testing & Validation

### Property Sync Test

```bash
# Trigger manual property sync (admin only)
curl -X POST http://localhost:8000/api/v1/properties/sync/trigger \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Response:
```json
{
  "status": "sync_started",
  "sync_id": "sync_20260520_143000",
  "message": "Property sync initiated"
}
```

### Check Sync Status

```bash
curl http://localhost:8000/api/v1/properties/sync/status
```

### Create Lead Test

```bash
curl -X POST http://localhost:8000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "inquirer_name": "Ahmed Al-Mazrouei",
    "inquirer_email": "ahmed@example.com",
    "inquirer_phone": "+971501234567",
    "message": "Interested in this villa"
  }'
```

### Webhook Simulation

```bash
# Test webhook signature verification
curl -X POST http://localhost:8000/api/v1/webhooks/reelly \
  -H "Content-Type: application/json" \
  -H "X-Reelly-Signature: YOUR_SIGNATURE" \
  -d '{
    "event_id": "evt_12345",
    "event_type": "property.created",
    "data": {
      "id": "prop_999",
      "title": "Test Property",
      "price": 1000000,
      ...
    }
  }'
```

---

## Troubleshooting

### Database Connection Issues

**Error**: `psycopg.OperationalError: connection failed`

**Solution**:
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Test connection:
   ```bash
   psql postgresql://postgres:password@localhost:5432/gulfvista_dev
   ```

### Scheduler Not Starting

**Error**: `Failed to initialize scheduler`

**Solution**:
1. Check `SCHEDULER_ENABLED=true` in `.env`
2. Verify APScheduler is installed: `pip install apscheduler==3.10.4`
3. Check logs for specific errors

### Reelly API Connection Fails

**Error**: `Failed to connect to Reelly API`

**Solution**:
1. Verify `REELLY_API_KEY` is correct
2. Check `REELLY_BASE_URL` is accessible
3. Test connection manually:
   ```python
   from services import ReelyApiClient
   client = ReelyApiClient(api_key="YOUR_KEY")
   # await client.verify_connection()
   ```

### Webhook Signature Verification Fails

**Error**: `Invalid webhook signature`

**Solution**:
1. Verify `REELLY_WEBHOOK_SECRET` matches Reelly dashboard
2. Check webhook body is not modified before verification
3. Ensure X-Reelly-Signature header is present
4. Test verification function:
   ```python
   from routes.webhooks import verify_reelly_signature
   is_valid = verify_reelly_signature(body, signature)
   ```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backed up
- [ ] REELLY_API_KEY verified working
- [ ] REELLY_WEBHOOK_SECRET configured
- [ ] SECRET_KEY set to secure random value
- [ ] CORS_ORIGINS updated for production domain
- [ ] LOG_LEVEL set to INFO (not DEBUG)
- [ ] Database migrations applied
- [ ] Startup verification passed
- [ ] Backup strategy in place

### Environment Setup

```env
# Production settings
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# Security
SECRET_KEY=your-very-long-random-secret-key-here

# Database
DATABASE_URL=postgresql+psycopg://user:password@prod-db:5432/gulfvista

# Reelly (use production API)
REELLY_API_KEY=your_production_api_key
REELLY_WEBHOOK_SECRET=your_production_webhook_secret

# Features
SCHEDULER_ENABLED=true
ENABLE_WEBHOOK_VERIFICATION=true

# CORS
CORS_ORIGINS=https://yourdomain.com
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Run with Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: gulfvista_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+psycopg://postgres:${DB_PASSWORD}@postgres:5432/gulfvista_prod
      REELLY_API_KEY: ${REELLY_API_KEY}
      SCHEDULER_ENABLED: "true"
    ports:
      - "8000:8000"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

## Support & Resources

- **API Documentation**: http://localhost:8000/api/docs
- **Reelly API Docs**: https://docs.reelly.io
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org

---

**Last Updated**: May 20, 2026  
**Phase 5 Status**: ✅ Complete  
**Next Phase**: Frontend Integration & Deployment
