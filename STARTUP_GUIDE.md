# 🚀 gulfvista.properties - Startup Guide

All setup steps 1-4 are **COMPLETE** ✅

---

## ✅ What Has Been Done

### Step 1: Project Organization ✅
- ✅ Created proper directory structure
- ✅ Organized all 27 files into correct locations
- ✅ Created .gitignore for version control

### Step 2: Backend Setup ✅
- ✅ Created Python virtual environment configuration
- ✅ Created `.env` file with all required variables
- ✅ Backend files properly named and organized
- ✅ Created production Dockerfile

### Step 3: Frontend Setup ✅
- ✅ Created React/TypeScript configuration
- ✅ Created `.env.local` with API configuration
- ✅ All components and utilities organized
- ✅ Created development Dockerfile

### Step 4: Docker Compose ✅
- ✅ docker-compose.yml fully configured
- ✅ Backend Dockerfile created
- ✅ Frontend Dockerfile.dev created
- ✅ PostgreSQL service configured
- ✅ Health checks configured
- ✅ Volumes and networks configured

---

## 📂 Project Structure

```
gulfvista.properties/
├── backend/
│   ├── auth.py              # JWT & security
│   ├── config.py            # Environment config
│   ├── database.py          # SQLAlchemy setup
│   ├── main.py              # FastAPI app
│   ├── models.py            # ORM models
│   ├── schemas.py           # Request/response validation
│   ├── sync_reelly.py       # API sync service
│   ├── mock_data.py         # Development seed data
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Production container
│   ├── .env                 # Configuration (ready)
│   └── .env.example         # Template
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── HeroSearch.tsx
│   │   │   └── PropertyCard.tsx
│   │   ├── services/        # API client
│   │   │   └── api.ts
│   │   ├── stores/          # State management
│   │   │   └── store.ts
│   │   ├── types/           # TypeScript types
│   │   │   └── types.ts
│   │   └── utils/           # Utilities
│   │       └── formatting.ts
│   ├── package.json         # Dependencies (ready)
│   ├── vite.config.ts       # Build config (ready)
│   ├── tailwind.config.ts   # Styling (ready)
│   ├── tsconfig.json        # TypeScript config (ready)
│   ├── postcss.config.js    # CSS processing (ready)
│   ├── Dockerfile.dev       # Dev container (ready)
│   └── .env.local           # Configuration (ready)
│
├── docker-compose.yml       # Service orchestration (ready)
├── .gitignore               # Git ignore rules
├── README.md                # Main documentation
├── ARCHITECTURE.md          # System design
├── PROJECT_SUMMARY.md       # Delivery details
├── INDEX.md                 # File reference
└── STARTUP_GUIDE.md         # This file

```

---

## 🐳 Running with Docker Compose (Recommended)

### Prerequisites
- Docker Desktop installed and running
- Docker Compose v2.0+

### Quick Start

```bash
# Navigate to project
cd gulfvista.properties

# Start all services
docker-compose up -d

# Wait for services to initialize (30-60 seconds)
docker-compose logs -f backend

# Check service status
docker-compose ps
```

### Access Services

Once running:

| Service | URL | Port |
|---------|-----|------|
| **Backend API** | http://localhost:8000 | 8000 |
| **API Docs (Swagger)** | http://localhost:8000/api/docs | 8000 |
| **Frontend** | http://localhost:5173 | 5173 |
| **PostgreSQL** | localhost | 5432 |

### Service Details

**PostgreSQL Database:**
```
Host: localhost
Port: 5432
Username: gulfvista
Password: secure_password_123
Database: gulfvista_dev
```

**Backend API:**
```
Service: gulfvista-api
Port: 8000
Hot-reload: Enabled (uvicorn --reload)
```

**Frontend Dev Server:**
```
Service: gulfvista-web
Port: 5173
Hot Module Reload: Enabled (Vite)
```

---

## 🛑 Stopping Services

```bash
# Stop all services (containers remain)
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove containers AND volumes (DELETES DATABASE!)
docker-compose down -v
```

---

## 🔄 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 50 lines
docker-compose logs --tail=50 backend
```

---

## 📝 First Steps After Starting

### 1. Verify Backend is Running
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","service":"gulfvista Real Estate API","version":"1.0.0"}
```

### 2. Access API Documentation
Open browser: http://localhost:8000/api/docs

### 3. Initialize Database (runs automatically in Docker)
The database is auto-initialized on first run.

### 4. Seed Development Data
Seed data is auto-loaded on startup (3 users, 4 properties).

**Test Credentials:**
```
agent@gulfvista.properties / SecurePassword123!
buyer@gulfvista.properties / SecurePassword123!
seller@gulfvista.properties / SecurePassword123!
```

### 5. Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@gulfvista.properties",
    "password": "SecurePassword123!"
  }'
```

Expected response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### 6. Test Property Listing
```bash
curl http://localhost:8000/api/v1/properties?limit=5
```

### 7. Access Frontend
Open browser: http://localhost:5173

---

## ⚙️ Configuration & Environment Variables

### Backend (.env)
Located at: `backend/.env`

Key variables:
```
DATABASE_URL=postgresql://gulfvista:secure_password_123@postgres:5432/gulfvista_dev
SECRET_KEY=your-super-secret-key-change-in-production
STRIPE_SECRET_KEY=sk_test_...
REELLY_API_KEY=your_api_key
DEBUG=False
```

### Frontend (.env.local)
Located at: `frontend/.env.local`

Key variables:
```
VITE_API_URL=http://localhost:8000
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🔧 Development Workflow

### Backend Development
```bash
# Backend code is hot-reloaded in Docker
# Edit files in backend/ and see changes immediately

# To run database migrations:
docker-compose exec backend alembic upgrade head

# To add new Python dependencies:
# 1. Add to backend/requirements.txt
# 2. Rebuild container:
docker-compose up -d --build backend
```

### Frontend Development
```bash
# Frontend code is hot-reloaded in Docker
# Edit files in frontend/src and see changes immediately

# To add new npm dependencies:
# 1. Add to frontend/package.json
# 2. Rebuild container:
docker-compose up -d --build frontend
```

---

## 🧪 Testing the API

### Register New User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "full_name": "New User",
    "password": "SecurePassword123!",
    "role": "buyer"
  }'
```

### List Properties
```bash
curl http://localhost:8000/api/v1/properties
```

### Filter Properties
```bash
curl "http://localhost:8000/api/v1/properties?city=Dubai&property_type=villa&min_price=1000000&max_price=5000000"
```

### Get Property Details
```bash
curl http://localhost:8000/api/v1/properties/1
```

---

## 🚨 Troubleshooting

### Services Won't Start
```bash
# Check if ports are already in use
lsof -i :8000
lsof -i :5173
lsof -i :5432

# Kill process using port (if needed)
kill -9 <PID>

# Try again
docker-compose up -d
```

### Database Connection Error
```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Frontend Can't Connect to API
```bash
# Check if backend is running
curl http://localhost:8000/health

# Check frontend logs
docker-compose logs frontend

# Verify CORS in backend/config.py
```

### Node_modules Issues
```bash
# Rebuild frontend with fresh dependencies
docker-compose down frontend
docker-compose up -d --build frontend
```

---

## 📊 Health Checks

All services have health checks configured:

```bash
# Check overall status
docker-compose ps

# Backend health
curl http://localhost:8000/health

# Database health
docker-compose exec postgres pg_isready -U gulfvista
```

---

## 🔐 Security Notes for Development

### These are DEV credentials only!
- Database password: `secure_password_123` → Change in production
- JWT Secret: Update in `.env` for production
- Stripe keys: Use test mode keys during development

### Before Production:
1. Generate strong SECRET_KEY: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
2. Use production Stripe keys
3. Configure real Reelly API credentials
4. Set `DEBUG=False`
5. Use strong PostgreSQL password
6. Enable HTTPS

---

## 📈 Next Steps

After confirming everything runs:

1. **Build remaining frontend pages:**
   - Property grid with filters
   - Property detail page
   - Agent dashboard
   - Authentication pages

2. **Connect to real APIs:**
   - Get Stripe production/test keys
   - Get Reelly API credentials
   - Configure webhooks

3. **Implement missing features:**
   - Image upload (AWS S3/Cloudinary)
   - Payment flow testing
   - Lead management
   - Agent dashboard analytics

4. **Testing:**
   - Unit tests for utilities
   - Integration tests for API
   - E2E tests for user flows

5. **Deployment:**
   - CI/CD pipeline (GitHub Actions)
   - Staging environment
   - Production deployment

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| **Start services** | `docker-compose up -d` |
| **Stop services** | `docker-compose down` |
| **View logs** | `docker-compose logs -f` |
| **Rebuild services** | `docker-compose up -d --build` |
| **Reset database** | `docker-compose down -v && docker-compose up -d` |
| **Run migrations** | `docker-compose exec backend alembic upgrade head` |
| **Seed data** | `docker-compose exec backend python mock_data.py` |
| **Backend shell** | `docker-compose exec backend bash` |
| **Frontend shell** | `docker-compose exec frontend sh` |

---

## ✨ Congratulations! 🎉

Your **gulfvista.properties** development environment is fully configured and ready to use!

All 4 setup steps are complete:
1. ✅ Project organized
2. ✅ Backend configured
3. ✅ Frontend configured
4. ✅ Docker Compose ready

Next: Run `docker-compose up -d` and start developing! 🚀

---

**Version:** 1.0.0
**Status:** Ready for Development
**Last Updated:** May 2026
