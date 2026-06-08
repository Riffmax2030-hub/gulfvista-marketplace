# Database Migration Guide - Phase 5

## Overview

This guide covers database migrations using Alembic for gulfvista.properties backend.

---

## Migration Files Created

### Alembic Setup Files
```
backend/alembic.ini                 - Alembic configuration
backend/alembic/env.py              - Migration environment setup
backend/alembic/script.py.mako      - Migration template
backend/alembic/versions/           - Migrations directory
```

### Migration Files
```
backend/alembic/versions/001_initial_schema.py
  - Creates all tables for Phases 1-5
  - Creates all enums (UserRole, PropertyType, PaymentStatus, LeadStatus, AgentStatus, LeadSource)
  - Creates 8 tables:
    * users
    * properties
    * transactions
    * property_sync_logs (Phase 5)
    * agent_stats (Phase 5)
    * reely_webhooks (Phase 5)
    * webhook_logs (Phase 4)
    * invoices (Phase 4)
    * leads (Phases 1-5)
  - Creates 28 indexes for optimal query performance
```

---

## Quick Start

### 1. Install Dependencies (if not already installed)
```bash
pip install -r requirements.txt
```

### 2. Initialize Database with Migrations

#### Option A: Using Alembic (Recommended)
```bash
# Navigate to backend directory
cd backend

# Apply all migrations to create schema
alembic upgrade head

# Verify migration was successful
alembic current
```

#### Option B: Using Python (Development Only)
```bash
# From project root or backend directory
python -c "from database import init_db; init_db()"
```

---

## Common Alembic Commands

### Apply Migrations
```bash
# Apply all pending migrations
alembic upgrade head

# Apply specific number of migrations
alembic upgrade +2

# Apply to specific revision
alembic upgrade 001_initial_schema
```

### Check Status
```bash
# Show current revision
alembic current

# Show migration history
alembic history
```

### Create New Migrations
```bash
# Auto-generate migration based on model changes
alembic revision --autogenerate -m "Description of changes"

# Create empty migration (manual)
alembic revision -m "Description of changes"
```

### Rollback Migrations
```bash
# Downgrade to previous revision
alembic downgrade -1

# Downgrade to specific revision
alembic downgrade 001_initial_schema

# Downgrade to base (empty database)
alembic downgrade base
```

---

## Database Schema Overview

### Tables Created

#### users (Phase 1)
- **Purpose**: User account management
- **Key Fields**: id, email (unique), full_name, hashed_password, role, is_agent_verified
- **Indexes**: email, role
- **Relationships**: properties (owner), transactions, leads (agent)

#### properties (Phase 2)
- **Purpose**: Property listings
- **Key Fields**: id, title, description, property_type, price, address, city, emirate
- **Unique**: source_id (Reelly integration)
- **Indexes**: owner_id, source_id, property_type, price
- **Relationships**: owner (User), leads

#### transactions (Phase 4)
- **Purpose**: Payment records for agent registration
- **Key Fields**: id, user_id, stripe_session_id, amount_cents, status (PaymentStatus)
- **Unique**: stripe_session_id, idempotency_key
- **Indexes**: user_id, status, created_at
- **Relationships**: user

#### property_sync_logs (Phase 5)
- **Purpose**: Audit trail for Reelly API syncs
- **Key Fields**: id, sync_type, status, started_at, completed_at, created_count, updated_count
- **Indexes**: status, created_at
- **Use Case**: Track all property synchronization operations

#### agent_stats (Phase 5)
- **Purpose**: Denormalized agent performance metrics
- **Key Fields**: id, agent_id (unique, FK), total_listings, total_leads, conversion_rate
- **Indexes**: agent_id, last_updated
- **Use Case**: Fast agent profile and stats lookup

#### reely_webhooks (Phase 5)
- **Purpose**: Inbound webhook event tracking
- **Key Fields**: id, reely_event_id (unique), event_type, payload (JSON), processed
- **Indexes**: reely_event_id, event_type, received_at
- **Use Case**: Prevent duplicate processing, audit trail

#### webhook_logs (Phase 4)
- **Purpose**: Stripe webhook event tracking
- **Key Fields**: id, stripe_event_id (unique), event_type, payload (JSON), processed
- **Indexes**: stripe_event_id, event_type, received_at
- **Use Case**: Audit trail for payments

#### invoices (Phase 4)
- **Purpose**: Invoice/receipt records
- **Key Fields**: id, transaction_id (FK), user_id (FK), invoice_number (unique), amount_cents
- **Indexes**: transaction_id, user_id, created_at
- **Relationships**: transaction, user

#### leads (Phases 1-5)
- **Purpose**: Property inquiry and lead management
- **Key Fields**: id, agent_id (FK), property_id (FK), inquirer_email, status (LeadStatus)
- **New Phase 5 Fields**: inquiry_date, assigned_at, last_contacted_at, follow_up_count, converted_at, conversion_value, source (LeadSource), notes, communication_log
- **Indexes**: agent_id, property_id, status, created_at, inquirer_email
- **Relationships**: agent (User), property

---

## Enums Created

### UserRole
- `buyer` - Regular property buyer
- `seller` - Property seller
- `agent_pending` - Agent awaiting verification
- `agent_admin` - Verified agent

### PropertyType
- `apartment` - Apartment/flat
- `villa` - Villa
- `townhouse` - Townhouse
- `land` - Vacant land
- `commercial` - Commercial property
- `office` - Office space

### PaymentStatus
- `pending` - Payment initiated
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

### LeadStatus (Phase 5)
- `new` - New lead
- `contacted` - Lead has been contacted
- `interested` - Lead is interested
- `negotiating` - Under negotiation
- `converted` - Converted to customer
- `lost` - Lost lead
- `cancelled` - Cancelled lead

### AgentStatus (Phase 5)
- `active` - Agent is active
- `inactive` - Agent is inactive
- `suspended` - Agent suspended
- `onboarding` - Agent in onboarding process

### LeadSource (Phase 5)
- `web_form` - From website form
- `property_inquiry` - From property page
- `reelly_webhook` - From Reelly API webhook
- `manual` - Manually created

---

## Environment Configuration

### Required for Alembic
```bash
# In .env or system environment
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

The migration automatically reads `DATABASE_URL` from:
1. Environment variable `DATABASE_URL`
2. Default: `postgresql://gulfvista:secure_password_123@postgres:5432/gulfvista_dev`

---

## Troubleshooting

### Migration Already Applied
```bash
# Check which revision is current
alembic current

# If already at head, no action needed
```

### PostgreSQL Connection Error
```bash
# Verify DATABASE_URL is correct
# Check PostgreSQL is running
# Verify credentials in .env
```

### Schema Mismatch
```bash
# If models don't match migrations, regenerate:
alembic revision --autogenerate -m "Fix schema"
```

### Start Fresh (Development Only)
```bash
# Drop all tables and start over
alembic downgrade base

# Then apply fresh migration
alembic upgrade head
```

---

## Integration with FastAPI

The migration system integrates with the existing FastAPI setup:

```python
# In main.py (backend initialization)
from database import init_db

@app.on_event("startup")
async def startup():
    # Option 1: Create tables directly (development)
    init_db()
    
    # Option 2: Or use Alembic migrations (production)
    # Run: alembic upgrade head
```

---

## Phase 5 Migration Summary

### What's New in This Migration
1. ✅ PropertySyncLog table for tracking Reelly syncs
2. ✅ AgentStats table for performance metrics
3. ✅ ReelyWebhook table for webhook tracking
4. ✅ Enhanced Lead model with 9 new fields
5. ✅ All necessary indexes for query performance
6. ✅ Foreign key relationships properly defined
7. ✅ Enum types for type safety

### Total Database Objects Created
- **Tables**: 9
- **Indexes**: 28
- **Enums**: 6
- **Foreign Keys**: 12

---

## Next Steps

### After Migration Success
1. ✅ Database schema is ready
2. 📋 Create Reelly API client service (Step 4)
3. 📋 Implement PropertySyncService (Step 5)
4. 📋 Implement LeadService (Step 6)
5. 📋 Implement AgentService (Step 7)

### Running Services
```bash
# Backend
cd backend
python -m uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

---

## References

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy ORM Documentation](https://docs.sqlalchemy.org/en/20/orm/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Created**: May 20, 2026  
**Phase**: Phase 5 - Reelly API Integration  
**Status**: ✅ Step 3 Complete - Database Migration Ready
