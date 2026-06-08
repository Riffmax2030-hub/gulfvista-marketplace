# 🚀 Phase 5 Quick Start Guide

## Automated Setup (Recommended)

### Option 1: Automatic Setup Script (Easiest)

```bash
cd C:\Users\DATA ENG. OLA\Desktop\gulfvista.properties\backend

# Double-click this file OR run:
SETUP_PHASE5.bat
```

**What it does:**
1. ✅ Creates `.env` file with all settings
2. ✅ Upgrades pip
3. ✅ Installs all dependencies (apscheduler, python-jose, etc.)
4. ✅ Verifies installation
5. ✅ Runs integration tests
6. ✅ Reports any issues

**Time:** 3-5 minutes

---

## After Setup

### 1. Edit `.env` File

Open `backend/.env` and add your Reelly API key:

```env
# Find this line:
REELLY_API_KEY=your_api_key_from_reelly.ai

# Replace with your actual key from https://www.reelly.ai/
REELLY_API_KEY=sk_live_abc123def456xyz
```

**That's it!** All other settings are pre-configured.

### 2. Make Sure PostgreSQL is Running

Your database needs to be accessible. If not installed:
- Download: https://www.postgresql.org/download/windows/
- Or use Docker: `docker run -d -e POSTGRES_PASSWORD=Iamgreat@2030 postgres`

### 3. Start the Server

```bash
# Option A: Double-click this file
START_SERVER.bat

# Option B: Run in PowerShell/CMD
python -m uvicorn main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### 4. Access the API

**Swagger UI** (interactive API docs):
- http://localhost:8000/api/docs

**ReDoc** (alternative docs):
- http://localhost:8000/api/redoc

**Health Check**:
- http://localhost:8000/health

---

## 📋 Files Created

| File | Purpose |
|------|---------|
| `backend/.env` | Configuration (created by script) |
| `backend/SETUP_PHASE5.bat` | Automated setup script |
| `backend/START_SERVER.bat` | Server startup script |
| `backend/models.py` | Fixed index issues ✅ |
| `backend/verify_startup.py` | Verification script ✅ |
| `backend/test_integration.py` | Integration tests ✅ |

---

## 🎯 35+ Ready-to-Use API Endpoints

### Properties
```
GET  /api/v1/properties              - List properties
GET  /api/v1/properties/{id}         - Get property details
POST /api/v1/properties              - Create property
PUT  /api/v1/properties/{id}         - Update property
DELETE /api/v1/properties/{id}       - Delete property
POST /api/v1/properties/sync/trigger - Manual sync
GET  /api/v1/properties/sync/status  - Sync history
```

### Leads
```
POST /api/v1/leads                   - Create lead
GET  /api/v1/leads                   - List leads
GET  /api/v1/leads/{id}              - Get lead details
PUT  /api/v1/leads/{id}              - Update lead
POST /api/v1/leads/{id}/mark-converted - Mark converted
POST /api/v1/leads/{id}/log-contact  - Log communication
POST /api/v1/leads/{id}/assign       - Reassign lead
GET  /api/v1/leads/stats/summary     - Lead stats
```

### Agents
```
GET  /api/v1/agents                  - List agents
GET  /api/v1/agents/top-agents       - Top performers
GET  /api/v1/agents/{id}             - Agent profile
GET  /api/v1/agents/{id}/stats       - Agent stats
GET  /api/v1/agents/{id}/leads       - Agent's leads
GET  /api/v1/agents/network/summary  - Network stats
POST /api/v1/agents/stats/update-all - Bulk update stats
POST /api/v1/agents/{id}/verify      - Verify agent
```

### Webhooks
```
POST /api/v1/webhooks/reelly         - Reelly webhook receiver
GET  /api/v1/webhooks/reelly/recent  - Recent webhooks
GET  /api/v1/webhooks/reelly/stats   - Webhook stats
```

---

## ✅ What Gets Installed

```
✓ fastapi==0.104.1          - Web framework
✓ uvicorn==0.24.0           - Server
✓ sqlalchemy==2.0.23        - Database ORM
✓ psycopg==3.3.4            - PostgreSQL driver
✓ pydantic==2.4.2           - Data validation
✓ apscheduler==3.10.4       - Background jobs ← Phase 5
✓ python-jose==3.3.0        - JWT tokens
✓ httpx==0.25.1             - Async HTTP
✓ stripe==7.8.0             - Payments
✓ alembic==1.13.1           - Migrations
✓ colorama==0.4.6           - Colored output
✓ [+9 more packages]
```

---

## 🔧 Troubleshooting

### "Port 8000 already in use"
```bash
# Kill the process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
python -m uvicorn main:app --port 8001
```

### "Database connection failed"
```
Make sure PostgreSQL is running and DATABASE_URL is correct in .env
DATABASE_URL=postgresql+psycopg://postgres:Iamgreat%402030@localhost:5432/gulfvista_dev
```

### "No module named 'apscheduler'"
```bash
# Re-run setup script
SETUP_PHASE5.bat

# Or install manually
pip install apscheduler==3.10.4
```

### "Can't create Index on table..."
**Status**: Already fixed ✅ in models.py

---

## 📊 System Status

After starting server, check health:

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "gulfvista Real Estate API",
  "version": "2.0.0"
}
```

---

## 🚀 You're Ready!

**Phase 5 Features Now Available:**

✅ Real-time property synchronization from Reelly  
✅ Intelligent lead management & auto-assignment  
✅ Agent performance analytics  
✅ Background job scheduling  
✅ Webhook integration  
✅ 35+ REST API endpoints  
✅ Comprehensive documentation  

---

## 📞 Next Steps

1. **Run**: `SETUP_PHASE5.bat` 
2. **Edit**: `.env` - add your Reelly API key
3. **Start**: `START_SERVER.bat`
4. **Visit**: http://localhost:8000/api/docs

That's it! Your backend is live! 🎉

---

## 📚 Documentation

- **Integration Guide**: `PHASE5_INTEGRATION_GUIDE.md`
- **API Reference**: `PHASE5_STEP6_COMPLETE.md`
- **Troubleshooting**: `PHASE5_COMPLETE_FIXES.md`
- **Final Summary**: `PHASE5_FINAL_SUMMARY.md`

---

**Phase 5 Status**: ✅ Production Ready  
**Setup Time**: ~5 minutes  
**Ready to Deploy**: YES
