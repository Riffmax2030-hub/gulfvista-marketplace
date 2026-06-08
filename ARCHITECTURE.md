# gulfvista.properties - Architecture & Design

## 🏛️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                    │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ React 18 + TypeScript + Tailwind CSS (Vite)              │ │
│ │ - HeroSearch Component (Property Filters)                │ │
│ │ - PropertyCard Grid (Listings)                           │ │
│ │ - Property Detail Page (Full Info + Map)                 │ │
│ │ - Agent Admin Dashboard (Analytics & Management)         │ │
│ └──────────────────────────────────────────────────────────┘ │
│                            ↓ HTTP/REST ↑                     │
│        Zustand State Management + Axios HTTP Client          │
└─────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────┐
│              API Layer (Backend)                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ FastAPI + Python 3.11                                    │ │
│ │                                                          │ │
│ │ ├─ /api/v1/auth (Login, Register, Token Refresh)       │ │
│ │ ├─ /api/v1/properties (List, Get, Create, Update)      │ │
│ │ ├─ /api/v1/payments (Stripe Integration)               │ │
│ │ └─ /api/v1/leads (Property Inquiries)                  │ │
│ │                                                          │ │
│ │ Authentication: JWT (access_token + refresh_token)      │ │
│ │ Authorization: Role-based (buyer, seller, agent_admin)  │ │
│ └──────────────────────────────────────────────────────────┘ │
│                      ↓ SQL ↑ Webhooks                        │
└─────────────────────────────────────────────────────────────┘
        ↓                           ↑         ↓              ↑
    ┌───────────────┐      ┌──────────────┐    ┌──────────────┐
    │  PostgreSQL   │      │ Stripe API   │    │  Reelly API  │
    │  Database     │      │  (Payments)  │    │  (Properties)│
    └───────────────┘      └──────────────┘    └──────────────┘
```

## 📦 Monorepo Structure

### Backend (`/backend`)

#### Core Application Files
- **main.py** - FastAPI application initialization & route definitions
- **config.py** - Environment configuration using Pydantic Settings
- **database.py** - SQLAlchemy session management & connection pooling
- **models.py** - SQLAlchemy ORM models (User, Property, Transaction, Lead)
- **schemas.py** - Pydantic request/response validation schemas
- **auth.py** - JWT token management & password hashing utilities

#### Services & Scripts
- **sync_reelly.py** - Automated property data sync from Reelly API
- **mock_data.py** - Development database seeding

#### Configuration Files
- **requirements.txt** - Python package dependencies
- **.env.example** - Environment variable template

### Frontend (`/frontend`)

#### Configuration Files
- **vite.config.ts** - Vite build configuration with path aliases
- **tailwind.config.ts** - Tailwind CSS theme customization
- **tsconfig.json** - TypeScript compiler configuration
- **postcss.config.js** - CSS processing pipeline
- **package.json** - Node.js dependencies & scripts

#### Source Code Structure (`/src`)
```
src/
├── components/          # Reusable React components
│   ├── HeroSearch      # Property search hero section
│   ├── PropertyCard    # Individual property listing
│   └── ...
├── pages/              # Page-level components
│   ├── HomePage
│   ├── PropertyDetail
│   ├── AgentDashboard
│   └── ...
├── hooks/              # Custom React hooks
│   └── useApi, useAuth, etc.
├── context/            # React Context providers
│   └── AuthContext, PropertyContext
├── services/           # API & service utilities
│   ├── api.ts         # Axios-based API client
│   └── ...
├── stores/             # Zustand state management
│   └── store.ts       # Auth, Properties, Dashboard stores
├── types/              # TypeScript type definitions
│   └── types.ts       # All type definitions
├── utils/              # Helper functions
│   └── formatting.ts  # Price, date, text formatting
└── assets/             # Images, fonts, icons
```

## 🔐 Authentication & Authorization

### JWT Token Flow
```
1. User Credentials
    ↓
2. POST /api/v1/auth/login
    ↓
3. Backend validates + generates tokens
    - access_token (30 min expiry)
    - refresh_token (7 days expiry)
    ↓
4. Client stores tokens in localStorage
    ↓
5. Include access_token in Authorization header for API calls
    - Header: "Authorization: Bearer {access_token}"
    ↓
6. On token expiry, refresh using refresh_token
    - Automatic via Axios interceptor
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **buyer** | View properties, submit leads, favorite listings |
| **seller** | View properties, sell to platform (future) |
| **agent_pending** | View properties, register (pending $200 payment) |
| **agent_admin** | All buyer permissions + create/edit/delete properties, manage leads |

**Payment Gate:** $200 USD one-time fee via Stripe to upgrade from `agent_pending` → `agent_admin`

## 💳 Payment Integration

### Stripe Checkout Flow
```
1. Agent clicks "Register as Agent" button
    ↓
2. POST /api/v1/payments/create-checkout-session
    ↓
3. Backend creates Stripe session, stores in transactions table
    {
        user_id: 123,
        stripe_session_id: "cs_test_...",
        amount_cents: 20000,  // $200
        status: "pending"
    }
    ↓
4. Client redirected to Stripe checkout (session.url)
    ↓
5. User enters payment details
    ↓
6. Stripe sends webhook: checkout.session.completed
    ↓
7. POST /api/v1/payments/webhook
    ↓
8. Backend updates:
    - Transaction status → "completed"
    - User.is_agent_verified → true
    - User.role → "agent_admin"
    ↓
9. Client polls /api/v1/auth/me to detect verification status
```

## 🔄 Reelly API Sync

### Property Data Pipeline
```
Reelly API
    ↓ (async fetch)
ReelylyApiClient
    ↓ (property_data)
PropertySyncService.sync_property()
    ↓
1. Check if property exists (by source_id)
2. Create or update Property ORM object
3. Map fields:
   - Type: apartment → PropertyType.APARTMENT
   - Images: array → JSON list
   - Coordinates: latitude, longitude
   - Developer: name + logo URL
4. Set source_platform = "reelly"
    ↓
PostgreSQL Database
```

### Sync Schedule
- **Interval:** Every 60 minutes (configurable)
- **Implementation:** APScheduler (production) or Celery
- **Error Handling:** Graceful logging, transaction rollback on failure
- **Idempotency:** Update by source_id, prevents duplicates

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('buyer', 'seller', 'agent_pending', 'agent_admin'),
    company_name VARCHAR(255),
    company_logo_url VARCHAR(500),
    is_agent_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Properties Table
```sql
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    property_type ENUM(...) NOT NULL,
    price FLOAT NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    price_per_sqft FLOAT,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    emirate VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'UAE',
    latitude FLOAT,
    longitude FLOAT,
    bedrooms INT,
    bathrooms INT,
    area_sqft FLOAT,
    year_built INT,
    furnishing VARCHAR(50),
    images JSON DEFAULT '[]',
    video_url VARCHAR(500),
    floor_plans JSON DEFAULT '[]',
    developer_name VARCHAR(255),
    project_name VARCHAR(255),
    developer_logo_url VARCHAR(500),
    source_id VARCHAR(255) UNIQUE,
    source_platform VARCHAR(50) DEFAULT 'reelly',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    owner_id INT FOREIGN KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT FOREIGN KEY NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount_cents INT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(50) DEFAULT 'agent_registration',
    status ENUM('pending', 'completed', 'failed', 'refunded'),
    metadata JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 Frontend Architecture

### Component Hierarchy
```
App
├── HeroSearch (Property Search Section)
├── PropertyGrid (List of PropertyCards)
│   └── PropertyCard (Individual Listing)
│       ├── Image Carousel
│       ├── Price Display
│       ├── Specs (Beds, Baths, Area)
│       ├── Developer Info
│       └── View Details Button
├── PropertyDetailPage (Full Listing Info)
│   ├── Image Gallery
│   ├── Property Details
│   ├── Payment Plans
│   ├── Map Integration
│   ├── Lead Form
│   └── Contact Agent
├── AgentDashboard (Protected Route)
│   ├── Dashboard Stats
│   ├── Property Management
│   ├── Lead Management
│   └── Profile Settings
└── AuthPages (Login, Register)
```

### State Management (Zustand)

**Auth Store**
```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null,
  
  login(email, password),
  register(data),
  logout(),
  fetchCurrentUser(),
  setError(),
  clearError()
}
```

**Properties Store**
```typescript
{
  properties: Property[],
  currentProperty: Property | null,
  isLoading: boolean,
  error: string | null,
  total: number,
  page: number,
  
  fetchProperties(page, filters),
  fetchPropertyDetail(id),
  createProperty(data),
  updateProperty(id, data),
  deleteProperty(id),
  setError(),
  clearError()
}
```

**Agent Dashboard Store**
```typescript
{
  stats: AgentDashboardStats | null,
  isLoading: boolean,
  error: string | null,
  
  fetchStats(userId),
  clearError()
}
```

### API Service (Axios)

**Features:**
- Base URL: http://localhost:8000/api/v1
- Automatic token injection in headers
- Request/response interceptors
- Automatic token refresh on 401
- Error extraction & formatting
- Singleton pattern

## 🚀 Deployment Architecture

### Development Stack
```
Local Machine
├── Backend (Python): uvicorn on :8000
├── Frontend (Node): Vite dev server on :5173
└── Database: PostgreSQL on :5432
```

### Production Stack

#### Backend
```
Docker Container
├── Python 3.11 slim image
├── FastAPI application
├── Uvicorn ASGI server
├── Gunicorn for production (optional)
└── Environment variables from secrets
    ↓
Kubernetes/Docker Compose
    ↓
PostgreSQL Cloud DB (AWS RDS, Google Cloud SQL)
External Services: Stripe, Reelly API
```

#### Frontend
```
Build Output (static files)
├── index.html
├── /assets/ (JS, CSS chunks)
└── /images/

Hosting Options:
├── Vercel (recommended for React)
├── Netlify
├── AWS CloudFront + S3
└── Docker + Nginx (self-hosted)
```

## 🔒 Security Considerations

### Backend
- **Password Hashing:** bcrypt with automatic salting
- **JWT:** RS256 (RSA) recommended for production
- **CORS:** Whitelist specific origins only
- **HTTPS:** Required in production
- **Rate Limiting:** Implement on critical endpoints
- **Input Validation:** Pydantic schemas
- **SQL Injection:** Parameterized queries via SQLAlchemy
- **CSRF:** Handled by SameSite cookie policy
- **Secrets Management:** Use .env files + secret management service

### Frontend
- **No Sensitive Data:** Never store passwords or API keys
- **LocalStorage Security:** Store only JWT tokens
- **XSS Protection:** React's built-in JSX escaping
- **CSP Headers:** Set strict Content-Security-Policy
- **Dependency Scanning:** Regular npm audit

### Data Protection
- **Encryption in Transit:** HTTPS/TLS 1.3
- **Encryption at Rest:** Database encryption
- **PII Handling:** Comply with GDPR/local privacy laws
- **Payment Data:** PCI-DSS compliance via Stripe

## 📈 Performance Optimization

### Backend
- **Database Indexing:** Foreign keys, email, role, price
- **Connection Pooling:** 20 connections + 40 overflow
- **Query Optimization:** Lazy loading, selective fields
- **Caching:** Redis for frequently accessed data (future)
- **Pagination:** Default 20 items/page

### Frontend
- **Code Splitting:** Vendor + utilities chunks
- **Image Optimization:** Responsive sizing, lazy loading
- **CSS-in-JS:** Tailwind purging unused styles
- **Bundle Size:** Keep <200KB initial JS
- **Caching:** Service Workers (PWA, future)

## 🧪 Testing Strategy

### Backend
```
Unit Tests
├── Auth utilities
├── Schema validation
└── Service functions

Integration Tests
├── API endpoint tests
├── Database operations
└── Stripe webhook handling

Load Testing
└── K6 or Apache JMeter
```

### Frontend
```
Component Tests
├── HeroSearch interaction
├── PropertyCard rendering
└── Form validation

E2E Tests
├── Login flow
├── Property search
├── Payment registration
└── Agent dashboard

Visual Regression
└── Percy or Chromatic
```

## 🛠️ Development Workflow

```
1. Branch Creation
   git checkout -b feature/property-filters

2. Local Development
   - Backend: uvicorn auto-reload
   - Frontend: Vite hot module replacement
   - Mock data via seed script

3. Testing
   - Run unit & integration tests
   - Manual QA in browser dev tools

4. Code Review
   - Format: prettier (frontend), black (backend)
   - Lint: ESLint, flake8
   - Type check: TypeScript, mypy

5. CI/CD Pipeline
   - GitHub Actions / GitLab CI
   - Run tests, linting, build checks
   - Deploy to staging

6. Deployment
   - Production builds
   - Database migrations
   - Smoke tests
```

## 📚 API Documentation

Auto-generated by FastAPI:
- **Swagger UI:** /api/docs
- **ReDoc:** /api/redoc

All endpoints have:
- Clear parameter documentation
- Request/response schema examples
- Authentication requirements
- Error responses

---

**Architecture Version:** 1.0.0
**Last Updated:** May 2026
**Status:** Production Ready
