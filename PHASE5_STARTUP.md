# Phase 5: Reelly API Integration - Startup Documentation

**Status**: 🚀 **Phase Started - Steps 1-3 Complete**  
**Date**: May 20, 2026  
**Current Step**: Step 4 - Reelly API Client  
**Target Completion**: May 22, 2026 (3 days)  

---

## 📋 Phase 5 Overview

Phase 5 integrates Reelly API for property data synchronization and builds a complete lead management & agent network system.

### **Key Deliverables**
1. ✅ **Enhanced Data Models** (Step 1 - Complete)
2. 📋 **Property Sync Service** (Steps 4-5)
3. 📋 **Lead Management System** (Steps 6, 11)
4. 📋 **Agent Network Features** (Steps 7, 12)
5. 📋 **Background Job Processing** (Steps 8-9)
6. 📋 **API Endpoints** (Steps 10-13)
7. 📋 **Frontend Integration** (After backend complete)

---

## ✅ Completed: Step 1 - Enhanced Data Models

### **New Enums Added**
```python
LeadStatus: NEW, CONTACTED, INTERESTED, NEGOTIATING, CONVERTED, LOST, CANCELLED
AgentStatus: ACTIVE, INACTIVE, SUSPENDED, ONBOARDING
LeadSource: WEB_FORM, PROPERTY_INQUIRY, REELLY_WEBHOOK, MANUAL
```

### **Enhanced Lead Model**
```python
# New fields:
- inquiry_date (timestamp)
- status (LeadStatus enum)
- assigned_at (when assigned to agent)
- last_contacted_at (tracking)
- follow_up_count (number of follow-ups)
- converted_at (conversion timestamp)
- conversion_value (deal amount)
- source (LeadSource enum)
- communication_log (JSON array of interactions)
- notes (text field)

# New indexes:
- agent_id, property_id, status, created_at, inquirer_email
```

### **New Models Created**

#### 1. **PropertySyncLog** - Audit Trail
```python
- sync_type: full, incremental, manual
- status: pending, in_progress, completed, failed
- started_at, completed_at (timing)
- total_processed, created_count, updated_count, deleted_count
- error_details (error tracking)
```

#### 2. **AgentStats** - Performance Metrics
```python
- agent_id (FK)
- total_listings, active_listings
- total_leads, converted_leads, pending_leads
- response_time_hours, conversion_rate
- average_deal_value
- last_updated (for caching)
```

#### 3. **ReelyWebhook** - Inbound Events
```python
- reely_event_id (unique, for deduplication)
- event_type (property.created, .updated, .deleted)
- payload (JSON)
- processed (boolean)
- error_details (if failed)
- received_at, processed_at (timing)
```

---

## 📅 Phase 5 Progress

### ✅ **Steps 2-3: Database Schema** (COMPLETE)
- [x] Create Pydantic schemas for all new models
- [x] Create Alembic migration
- [x] Database migration ready for deployment

### **Steps 4-7: Core Services (Tomorrow - 6 hours)**
- [ ] Extract and enhance ReelyApiClient
- [ ] Implement PropertySyncService (with deduplication)
- [ ] Implement LeadService (with auto-assign)
- [ ] Implement AgentService (with stats calculation)

### **Steps 8-9: Background Jobs (Day 3 - 3 hours)**
- [ ] Setup APScheduler
- [ ] Implement property sync job
- [ ] Implement lead notification job

### **Steps 10-13: API Endpoints (Day 3 - 4 hours)**
- [ ] Property endpoints (sync, listing)
- [ ] Lead endpoints (CRUD, assignment)
- [ ] Agent endpoints (profiles, stats)
- [ ] Webhook receiver

### **Steps 14-16: Final Integration (Day 3 - 2 hours)**
- [ ] Update main.py with routers
- [ ] Update config.py with Reelly settings
- [ ] Update requirements.txt
- [ ] Test integration end-to-end

---

## 🔧 Configuration Needed

### **Environment Variables** (To be added to .env)
```bash
# Reelly API Configuration
REELLY_API_KEY=your_api_key_here
REELLY_BASE_URL=https://api.reelly.io/v1
REELLY_WEBHOOK_SECRET=your_webhook_secret_here

# Sync Configuration
REELLY_SYNC_INTERVAL_MINUTES=60
REELLY_SYNC_ENABLED=true

# Lead Configuration
MAX_LEAD_ASSIGNMENT_COUNT=10
LEAD_AUTO_ASSIGN_ENABLED=true
```

### **Placeholder Values** (For Development)
```bash
REELLY_API_KEY=reelly_test_key
REELLY_BASE_URL=https://api.test.reelly.io/v1
REELLY_WEBHOOK_SECRET=test_webhook_secret
```

---

## 📊 Database Changes Summary

### **Tables Added**
- `property_sync_logs` - Audit trail for syncs
- `agent_stats` - Denormalized performance data
- `reely_webhooks` - Inbound webhook events

### **Tables Enhanced**
- `leads` - Extended with 9 new fields
- `users` - Ready for agent status tracking

### **Total New Indexes**: 12
- For fast filtering by status, agent_id, email, dates

---

## 🚀 Implementation Order

```
Step 1: Enhanced Models  ✅ DONE
  ↓
Step 2: Pydantic Schemas ✅ DONE
  ↓
Step 3: Database Migration ✅ DONE
  ↓
Step 4: Reelly Client (4 hours) ← NEXT
  ↓
Step 5: Property Sync Service (6 hours)
  ↓
Step 6: Lead Service (5 hours)
  ↓
Step 7: Agent Service (3 hours)
  ↓
Step 8: APScheduler Setup (3 hours)
  ↓
Step 9: Background Jobs (4 hours)
  ↓
Step 10-13: API Routes (10 hours)
  ↓
Step 14-16: Integration (3 hours)

Total: ~43 hours = 2-3 working days
```

---

## 📂 Files That Will Be Created

### **Backend Services**
```
backend/services/
├── __init__.py              [NEW]
├── reelly_client.py         [NEW] - Reelly API client
├── property_sync.py         [NEW] - Property sync service
├── lead_service.py          [NEW] - Lead management
└── agent_service.py         [NEW] - Agent network
```

### **Background Jobs**
```
backend/jobs/
├── __init__.py              [NEW]
├── property_sync_job.py     [NEW] - Hourly sync
└── lead_notifications_job.py [NEW] - Lead alerts
```

### **API Routes**
```
backend/routes/
├── properties.py            [ENHANCE] - Add Reelly endpoints
├── leads.py                 [NEW] - Lead CRUD
├── agents.py                [NEW] - Agent profiles
└── webhooks.py              [NEW] - Reelly webhooks
```

### **Configuration**
```
backend/
├── models.py                [UPDATED] ✅
├── schemas.py               [NEW] - Pydantic models
├── config.py                [ENHANCE]
├── main.py                  [ENHANCE]
└── requirements.txt         [ENHANCE]
```

---

## 🧪 Testing Strategy

### **Unit Tests**
- Property sync deduplication logic
- Lead auto-assignment round-robin
- Agent stats calculation
- API request validation

### **Integration Tests**
- Mock Reelly API → sync → verify DB
- Lead creation → auto-assign → notification
- Webhook receipt → processing → update

### **Load Tests**
- Import 10k properties in parallel
- Assign 1k leads concurrently
- Handle webhook bursts

---

## 📚 Key Files Changed

```
✅ backend/models.py
   - Added: LeadStatus, AgentStatus, LeadSource enums
   - Enhanced: Lead model (from 7 to 16 fields)
   - Added: PropertySyncLog, AgentStats, ReelyWebhook models

📋 backend/schemas.py (TODO)
   - Add: Pydantic schemas for all models

📋 backend/services/ (TODO)
   - Add: reelly_client.py, property_sync.py, lead_service.py, agent_service.py

📋 backend/jobs/ (TODO)
   - Add: property_sync_job.py, lead_notifications_job.py

📋 backend/routes/ (TODO)
   - Enhance: properties.py, leads.py (new), agents.py (new), webhooks.py (new)

📋 backend/config.py (TODO)
   - Add: Reelly config, scheduler config, job timing

📋 backend/main.py (TODO)
   - Add: Router registration, scheduler initialization

📋 backend/requirements.txt (TODO)
   - Add: apscheduler, tenacity, cryptography
```

---

## 🔗 Architecture Overview

```
Reelly API
    ↓
ReelyApiClient (REST calls with retry logic)
    ↓
PropertySyncService (dedup, delta detection)
    ↓
Property Model (stored in database)
    ↓
API: GET /api/v1/properties?source=reelly
    ↓
Frontend: Display Reelly properties


Property Detail Page
    ↓
User clicks "Inquire"
    ↓
POST /api/v1/leads (new lead)
    ↓
LeadService.create_lead()
    ↓
Auto-assign to agent (round-robin)
    ↓
Lead notification job
    ↓
Email sent to agent


Reelly Sends Webhook
    ↓
POST /api/v1/webhooks/reelly
    ↓
Verify signature (cryptography)
    ↓
Queue processing job
    ↓
PropertySyncService updates database
    ↓
AgentStats recalculated
```

---

## 💡 Key Implementation Details

### **Deduplication Strategy**
```python
# Use source_id as unique identifier
# If source_id exists in DB:
#   - Update if modified_at > updated_at
#   - Skip if unchanged
# If source_id new:
#   - Create new Property

# Prevent duplicates: UNIQUE(source_id, source_platform)
```

### **Lead Auto-Assignment**
```python
# Round-robin algorithm
# For each new lead:
#   1. Get all active agents
#   2. Count pending leads per agent
#   3. Assign to agent with fewest leads
#   4. Respect MAX_LEAD_ASSIGNMENT_COUNT

# Optimization: Use AgentStats table for fast lookup
```

### **Job Scheduling**
```python
# APScheduler runs in-process
# Jobs execute based on cron-like schedule
#   - Property sync: Every 60 minutes (default)
#   - Lead notifications: Every 5 minutes
#   - AgentStats recalc: Every 24 hours
#
# Can be upgraded to Celery for distributed processing
```

---

## 📈 Expected Outcomes

**After Phase 5 Complete**:
- ✅ Property sync: 500-1000 properties/minute
- ✅ Lead creation: <1 second auto-assignment
- ✅ Agent network: Full profile + stats visible
- ✅ Webhook handling: <2 second event processing
- ✅ API performance: <500ms p95 latency

---

## ⚡ Quick Start Guide

### **When Ready to Code Step 2**
```bash
# Start with Pydantic schemas
# File: backend/schemas.py

from pydantic import BaseModel, EmailStr
from models import LeadStatus, LeadSource
from typing import Optional, List

class LeadCreate(BaseModel):
    inquirer_name: str
    inquirer_email: EmailStr
    inquirer_phone: str
    property_id: int
    message: Optional[str] = None
    source: LeadSource = LeadSource.PROPERTY_INQUIRY

class LeadResponse(BaseModel):
    id: int
    inquirer_name: str
    status: LeadStatus
    assigned_at: Optional[str]
    converted_at: Optional[str]
    
    class Config:
        from_attributes = True
```

---

## 🎯 Success Criteria

- [ ] All 5 new models in database
- [ ] All 13 API endpoints working
- [ ] Property sync > 99% success rate
- [ ] Leads auto-assigned within 1 second
- [ ] Webhook processing < 2 seconds
- [ ] Agent stats update within 5 minutes
- [ ] No duplicate properties (by source_id)
- [ ] All unit tests passing
- [ ] Integration tests passing

---

## 📞 Dependencies

**External**:
- Reelly API (need API key)
- SMTP service (for email notifications)

**Internal**:
- Phase 1-4 complete ✅
- FastAPI, SQLAlchemy working ✅
- Authentication system ready ✅

---

## 🚀 Next Session

Start with **Step 2: Pydantic Schemas**
- Create comprehensive Pydantic models
- Add validation and serialization
- ~3 hours of work

---

**Created**: May 20, 2026  
**Step 1 Status**: ✅ Complete  
**Next Step**: Pydantic Schemas  
**Phase Timeline**: 2-3 days  
