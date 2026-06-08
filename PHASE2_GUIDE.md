# Phase 2: Backend Features - Testing Guide

## What's New in Phase 2

Phase 2 implements the complete backend with:
- ✅ **User Authentication**: Registration, Login, JWT tokens
- ✅ **Property Management**: Create, Read, Update, Delete properties
- ✅ **Search & Filtering**: Search by title, filters by price/bedrooms/city
- ✅ **Role-Based Access**: Buyer, Seller, Agent roles with verification
- ✅ **User Dashboard**: Users can view and manage their properties

---

## Getting Started

### 1. Stop Old Containers
```bash
cd C:\Users\DATA ENG. OLA\Desktop\gulfvista.properties
docker-compose down
```

### 2. Rebuild and Start
```bash
docker-compose up -d
```

Check if services are running:
```bash
docker-compose ps
```

All three services should show "healthy":
- `gulfvista-db` (PostgreSQL)
- `gulfvista-api` (Backend API)
- `gulfvista-web` (Frontend)

---

## Testing the API

### Access Points
- **API Documentation**: http://localhost:8000/api/docs
- **Backend Health**: http://localhost:8000/health
- **Frontend**: http://localhost:5173

### Test Flow

#### Step 1: Register a User
```
POST http://localhost:8000/api/v1/auth/register

Body (JSON):
{
  "email": "sherif@gulfvista.properties",
  "password": "SecurePassword123!",
  "full_name": "Sherif Olaide",
  "phone": "+971-50-123-4567"
}

Response:
{
  "id": 1,
  "email": "sherif@gulfvista.properties",
  "full_name": "Sherif Olaide",
  "role": "buyer",
  "is_agent_verified": false,
  "is_active": true
}
```

#### Step 2: Login User
```
POST http://localhost:8000/api/v1/auth/login

Body (JSON):
{
  "email": "sherif@gulfvista.properties",
  "password": "SecurePassword123!"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": { ... }
}

💡 Save the access_token - you'll need it for other endpoints!
```

#### Step 3: Get Current User Profile
```
GET http://localhost:8000/api/v1/auth/me

Headers:
Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "email": "sherif@gulfvista.properties",
  "full_name": "Sherif Olaide",
  "role": "buyer",
  "is_agent_verified": false,
  "is_active": true
}
```

#### Step 4: Create a Property (as Seller)
First, register a SELLER:
```
POST http://localhost:8000/api/v1/auth/register

Body (JSON):
{
  "email": "seller@gulfvista.properties",
  "password": "SecurePassword123!",
  "full_name": "John Smith",
  "phone": "+971-50-987-6543"
}
```

Then change role to SELLER in database (or create another endpoint later).

For now, use this endpoint as BUYER to see the error:
```
POST http://localhost:8000/api/v1/properties

Headers:
Authorization: Bearer {access_token}

Body (JSON):
{
  "title": "Luxury Villa in Arabian Ranches",
  "description": "4BR villa with private pool and garden",
  "property_type": "villa",
  "price": 3500000.0,
  "address": "Arabian Ranches, Dubai",
  "city": "Dubai",
  "emirate": "Dubai",
  "bedrooms": 4,
  "bathrooms": 3,
  "area_sqft": 4500.0,
  "furnishing": "unfurnished"
}

Error Response (as buyer):
{
  "detail": "Only sellers and agents can create properties"
}
```

#### Step 5: Search Properties
```
GET http://localhost:8000/api/v1/properties?search=villa&min_price=1000000&max_price=5000000

Response:
{
  "items": [...],
  "total": 2,
  "page": 1,
  "page_size": 20
}
```

#### Step 6: Filter Properties
```
GET http://localhost:8000/api/v1/properties?bedrooms=3&city=Dubai&property_type=apartment

Response:
{
  "items": [...],
  "total": 5,
  "page": 1,
  "page_size": 20
}
```

---

## Using Swagger UI

The easiest way to test is using FastAPI's Swagger UI:

1. Go to: **http://localhost:8000/api/docs**
2. Click on any endpoint to expand it
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"

For endpoints requiring authentication:
1. Login first (POST /api/v1/auth/login)
2. Copy the `access_token` from response
3. Click the green "Authorize" button at top
4. Paste: `Bearer {your_access_token}`
5. Click "Authorize" then "Close"
6. Now try other endpoints

---

## Key Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user (returns JWT token)
- `GET /api/v1/auth/me` - Get current user profile

### Properties (Public)
- `GET /api/v1/properties` - List all properties (with search/filters)
- `GET /api/v1/properties/{id}` - Get property details

### Properties (Private - Requires Auth)
- `POST /api/v1/properties` - Create property (sellers/agents only)
- `PUT /api/v1/properties/{id}` - Update property (owner only)
- `DELETE /api/v1/properties/{id}` - Delete property (owner only)

### User Dashboard
- `GET /api/v1/users/me/properties` - Get current user's properties

### Statistics
- `GET /api/v1/stats` - Get platform statistics

---

## Common Issues & Solutions

### Issue: "Connection refused" on Backend
**Solution**: 
```bash
docker-compose logs -f backend
# Check if database is ready
docker-compose logs -f postgres
```

### Issue: JWT Token Error
**Solution**: Make sure token is in header as: `Authorization: Bearer {token}`

### Issue: Property Creation Denied
**Solution**: User must be Seller or Agent role. Currently all registrations default to Buyer. 

**Quick Fix** (for testing):
1. Access database directly: `psql -U gulfvista -h localhost -d gulfvista_dev`
2. Update user role: `UPDATE users SET role = 'seller' WHERE email = 'seller@gulfvista.properties';`

### Issue: "Property not found" on update/delete
**Solution**: Use correct property_id and make sure you own it

---

## Database Schema (Phase 2)

### Users Table
```
id (Primary Key)
email (Unique)
full_name
hashed_password
phone
role (buyer, seller, agent_pending, agent_admin)
is_agent_verified (Boolean)
is_active (Boolean)
created_at
updated_at
```

### Properties Table
```
id (Primary Key)
title
description
property_type (apartment, villa, townhouse, land, commercial, office)
price
currency (default: AED)
address
city
emirate
bedrooms
bathrooms
area_sqft
furnishing
images (JSON array)
owner_id (Foreign Key to Users)
is_active
is_featured
views_count
created_at
updated_at
```

---

## Next Steps (Phase 3)

After testing Phase 2 backend:
1. Build React components for property listing page
2. Build property search page with filters
3. Build property detail page
4. Build login/registration forms
5. Build user dashboard
6. Add image upload functionality

---

## Troubleshooting

### Docker Commands
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Clean restart (remove volumes)
docker-compose down -v && docker-compose up -d

# Check if ports are in use
netstat -ano | findstr :8000
netstat -ano | findstr :5432
netstat -ano | findstr :5173
```

### Database Debugging
```bash
# Connect to database
psql -U gulfvista -h localhost -d gulfvista_dev

# List tables
\dt

# View users
SELECT * FROM users;

# View properties
SELECT * FROM properties;
```

---

## Success Indicators

✅ All three containers are healthy
✅ Can register a user
✅ Can login and get JWT token
✅ Can view current user profile
✅ Can search properties
✅ Can create property (as seller)
✅ All API docs load at `/api/docs`

---

**Status**: Phase 2 Backend ✅ Complete & Ready for Testing
**Next**: Phase 3 - Frontend Components

For questions or issues, check logs: `docker-compose logs -f`
