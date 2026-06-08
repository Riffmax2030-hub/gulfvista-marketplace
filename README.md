# 🏘️ GulfVista Marketplace

A premium real estate marketplace platform for the Gulf countries with Reelly API integration, lead management, and agent network features.

**Live Demo:** [https://gulfvista-marketplace.vercel.app](https://gulfvista-marketplace.vercel.app)  
**API Docs:** [https://gulfvista-api.onrender.com/api/docs](https://gulfvista-api.onrender.com/api/docs)  
**GitHub Repo:** [gulfvista-marketplace](https://github.com/Riffmax2030-hub/gulfvista-marketplace)

---

## 🎯 Features

### 🏠 Property Management
- Browse premium property listings with advanced filtering
- Multi-country support (UAE, Saudi Arabia, Kuwait, etc.)
- Property details with images and descriptions
- Real-time property synchronization from Reelly API

### 👥 Lead Management
- Automated lead capture from property inquiries
- Lead status tracking (NEW, CONTACTED, INTERESTED, NEGOTIATING, CONVERTED, LOST)
- Lead assignment to agents
- Follow-up notifications and reminders

### 🤝 Agent Network
- Agent registration and verification
- Agent statistics and performance tracking
- Direct lead assignment and management
- Notification system for agent activities

### 💳 Payments (Ready for Integration)
- Stripe payment processing setup
- Transaction history
- Payment status tracking

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.13)
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Authentication:** JWT tokens
- **Background Jobs:** APScheduler
- **API Integration:** Reelly API client

### Frontend
- **Framework:** React 18 + Vite
- **State Management:** Zustand
- **Styling:** TailwindCSS
- **UI Components:** Lucide icons
- **HTTP Client:** Axios

### Deployment
- **Backend:** Render.com (Free tier)
- **Frontend:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Containerization:** Docker & Docker Compose

---

## 📋 Prerequisites

### Local Development
- Python 3.13+
- Node.js 20+ & npm 11+
- PostgreSQL 15+ (or Docker)
- Git

### Cloud Deployment
- GitHub account (repo connected)
- Render.com account
- Vercel account
- Supabase account
- Reelly API key

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Riffmax2030-hub/gulfvista-marketplace.git
cd gulfvista-marketplace
```

### 2. Backend Setup (Local)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (use .env.example as template)
cp .env.example .env
# Edit .env with your database URL

# Run database migrations
alembic upgrade head

# Start server
python -m uvicorn main:app --reload
```

**Backend will run on:** http://localhost:8000
**API Docs:** http://localhost:8000/api/docs

### 3. Frontend Setup (Local)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Start dev server
npm run dev
```

**Frontend will run on:** http://localhost:5173

### 4. Docker Compose (All Services)

```bash
# From project root
docker-compose up -d

# Services available:
# - Backend: http://localhost:8000
# - Frontend: http://localhost:5173
# - Database: localhost:5432

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

## 🌐 Production Deployment

### ⚠️ IMPORTANT: Pre-Deployment Checklist

Before deploying to Render and Vercel, ensure you have:

- [ ] **Supabase Database Created**
  - Go to https://supabase.com
  - Create project: "gulfvista-marketplace"
  - Region: UAE/Dubai or Singapore
  - Save connection string

- [ ] **All Environment Variables Ready**
  - DATABASE_URL (from Supabase)
  - REELLY_API_KEY (provided)
  - SECRET_KEY (JWT secret)

- [ ] **GitHub Repository Updated**
  - All code pushed to main branch
  - .env files not committed (security)

---

### Step 1: Create Supabase Database

1. Go to https://supabase.com
2. Click **"Create a new project"**
3. **Settings:**
   - Project Name: `gulfvista-marketplace`
   - Database Password: Create STRONG password (save it!)
   - Region: `UAE (Dubai)` or `Singapore`
4. Wait 2-3 minutes for initialization
5. Get connection string:
   - Settings → Database → Connection Pooling
   - Copy PostgreSQL URI in format:
     ```
     postgresql://postgres:PASSWORD@HOST:6543/postgres
     ```
6. **⭐ Save this for Render!**

---

### Step 2: Deploy Backend to Render

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy from GitHub"** → `gulfvista-marketplace`

**Configuration:**
```
Name:             gulfvista-api
Environment:      Python 3
Region:           Frankfurt
Root Directory:   backend
Build Command:    pip install -r requirements.txt && alembic upgrade head
Start Command:    uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type:    Free
```

**Environment Variables (add in "Advanced" section):**
```
DATABASE_URL = postgresql://postgres:PASSWORD@HOST:6543/postgres
SECRET_KEY = your-secret-key-change-in-production
REELLY_API_KEY = your-reelly-api-key
DEBUG = false
CORS_ORIGINS = ["https://gulfvista-marketplace.vercel.app"]
```

4. Click **"Create Web Service"**
5. Wait 5-10 minutes for deployment
6. **⭐ Copy your Render URL:** `https://gulfvista-api.onrender.com`

---

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"** → `gulfvista-marketplace`

**Configuration:**
```
Framework:         Vite
Root Directory:    frontend/
Build Command:     npm run build
Output Directory:  dist
Install Command:   npm install
```

**Environment Variables:**
```
VITE_API_URL = https://gulfvista-api.onrender.com
REACT_APP_API_URL = https://gulfvista-api.onrender.com
REACT_APP_STRIPE_PUBLISHABLE_KEY = pk_test_your_key
```

4. Click **"Deploy"**
5. Wait 3-5 minutes

---

### Step 4: Verify Deployment ✅

```bash
# Test backend health
curl https://gulfvista-api.onrender.com/health
# Expected: {"status":"ok"}

# Test API is accessible
curl https://gulfvista-api.onrender.com/api/properties

# Visit frontend
https://gulfvista-marketplace.vercel.app

# Check browser console (F12) for any errors
```

---

## 📚 API Documentation

### Base URL
- **Local:** http://localhost:8000
- **Production:** https://gulfvista-api.onrender.com

### Interactive Docs
- **Swagger UI:** `/api/docs`
- **ReDoc:** `/api/redoc`

### Key Endpoints

#### Properties
```bash
GET  /api/properties              # List all properties
GET  /api/properties/{id}         # Get property details
POST /api/properties              # Create property (admin)
```

#### Leads
```bash
POST /api/leads                   # Create lead
GET  /api/leads                   # List leads (agent only)
GET  /api/leads/{id}              # Get lead details
PUT  /api/leads/{id}              # Update lead status
```

#### Agents
```bash
GET  /api/agents                  # List agents
GET  /api/agents/{id}             # Get agent profile
POST /api/agents                  # Register agent
```

#### Health
```bash
GET  /health                      # Health check
GET  /api/properties/count        # Total properties
```

---

## 🐛 Troubleshooting

### "Database connection failed" on Render

**Problem:** DATABASE_URL not set correctly
```
Solutions:
1. Check Supabase connection string format
2. Verify password doesn't have unescaped special chars
3. Ensure port is 6543 (not 5432)
4. Test locally: psql "your_connection_string"
```

### "Cannot connect to API" from Frontend

**Problem:** CORS error or wrong API URL
```
Solutions:
1. Check VITE_API_URL matches your Render URL exactly
2. Verify CORS_ORIGINS in backend includes Vercel domain
3. Check browser console (F12) for CORS errors
4. Test with curl: curl https://your-render-url/health
```

### "Port 8000 already in use" (Local)

```bash
# Find process using port
lsof -i :8000        # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # or use Windows Task Manager
```

### "Build failed" on Render/Vercel

**Check:**
1. Root Directory is set correctly (backend/ or frontend/)
2. Build Command is correct
3. All environment variables are set
4. No syntax errors in code
5. Dependencies are in package.json or requirements.txt

---

## 📁 Project Structure

```
gulfvista-marketplace/
├── backend/
│   ├── main.py                     # FastAPI app
│   ├── models.py                   # Database models
│   ├── schemas.py                  # Request/response schemas
│   ├── routes/                     # API endpoints
│   ├── services/                   # Business logic
│   ├── jobs/                       # Background jobs
│   ├── requirements.txt            # Python packages
│   ├── Dockerfile                  # Docker image
│   ├── .env.example               # Env template
│   └── alembic/                    # Database migrations
│
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── services/               # API client
│   │   ├── stores/                 # Zustand stores
│   │   └── types/                  # TypeScript types
│   ├── package.json                # Node packages
│   ├── vite.config.ts              # Vite config
│   ├── .env.local                  # Local env
│   ├── .env.production             # Production env
│   └── Dockerfile.dev              # Docker image
│
├── docker-compose.yml              # Local dev
├── docker-compose.production.yml   # Production
├── vercel.json                     # Vercel config
├── README.md                       # This file
└── CLOUD_DEPLOYMENT_STEPS.md       # Detailed guide
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/gulfvista

# Authentication
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Reelly API
REELLY_API_KEY=your-reelly-api-key
REELLY_BASE_URL=https://api-reelly.up.railway.app/api/v2/clients

# Server
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=false

# CORS
CORS_ORIGINS=["http://localhost:5173","https://yourdomain.com"]

# Features
ENABLE_PROPERTY_SYNC=true
ENABLE_LEAD_AUTO_ASSIGNMENT=true
```

### Frontend (.env.local or .env.production)

```env
VITE_API_URL=http://localhost:8000
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

---

## 🚀 Useful Commands

### Backend
```bash
python -m uvicorn main:app --reload              # Run locally
python -m pytest                                 # Run tests
alembic revision --autogenerate -m "desc"       # Create migration
alembic upgrade head                             # Apply migrations
```

### Frontend
```bash
npm run dev                                      # Dev server
npm run build                                    # Build
npm run preview                                  # Preview build
npm run type-check                               # Type check
```

### Docker
```bash
docker-compose up -d                            # Start all
docker-compose down                             # Stop all
docker-compose logs -f backend                  # View logs
docker-compose exec backend bash                # Access shell
```

---

## 📞 Support & Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m 'Add YourFeature'`
4. Push: `git push origin feature/YourFeature`
5. Open Pull Request

---

## 📄 License

Proprietary - All rights reserved

---

**Version:** 1.0.0  
**Last Updated:** June 2026  
**Status:** Production Ready ✅
