"""
FastAPI application for gulfvista.properties - Full Production Version
Implements Phase 2: Backend Features (User Auth, Property CRUD, Search)
"""

import logging
import math
from dotenv import load_dotenv

# Load environment variables from .env file FIRST
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import config
from database import get_db, init_db
from models import User, UserRole, Property, PropertyType
from auth import AuthenticationService, get_current_user
from payments import router as payment_router
from jobs import init_scheduler, stop_scheduler, get_job_status
from routes import api_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=config.APP_NAME,
    description="Premium Real Estate Marketplace API - Phase 2",
    version="2.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include payment routes (Phase 4: Stripe Integration)
app.include_router(payment_router)

# Include Phase 5 routes (Properties, Leads, Agents, Webhooks)
app.include_router(api_router)


# ============================================================================
# Pydantic Models for Request/Response
# ============================================================================

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_agent_verified: bool
    is_active: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class PropertyCreateRequest(BaseModel):
    title: str
    description: str
    property_type: str
    price: float
    address: str
    city: str
    emirate: str
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqft: Optional[float] = None
    furnishing: Optional[str] = None


class PropertyResponse(BaseModel):
    id: int
    title: str
    description: str
    property_type: str
    price: float
    currency: str
    address: str
    city: str
    bedrooms: Optional[int]
    bathrooms: Optional[int]
    area_sqft: Optional[float]
    owner_id: Optional[int]
    is_active: bool
    views_count: int

    class Config:
        from_attributes = True


class PropertyListResponse(BaseModel):
    items: List[PropertyResponse]
    total: int
    page: int
    page_size: int


# ============================================================================
# Startup Events
# ============================================================================

@app.on_event("startup")
async def startup():
    """Initialize database and background jobs on application startup."""
    logger.info("🚀 Initializing gulfvista.properties backend...")

    # Initialize database
    init_db()
    logger.info("✅ Database initialized")

    # Initialize background job scheduler (Phase 5)
    try:
        init_scheduler()
        logger.info("✅ Background job scheduler initialized")
    except Exception as e:
        logger.error(f"⚠️  Failed to initialize scheduler: {e}")

    logger.info("✅ Backend fully initialized - All features active")


@app.on_event("shutdown")
async def shutdown():
    """Clean up resources on application shutdown."""
    logger.info("🛑 Shutting down gulfvista.properties backend...")
    stop_scheduler()
    logger.info("✅ Graceful shutdown complete")


# ============================================================================
# Health & Status Endpoints
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": config.APP_NAME,
        "version": "2.0.0",
        "phase": "Phase 2: Backend Features",
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to gulfvista.properties API - Phase 2",
        "docs": "/api/docs",
        "health": "/health",
    }


# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post(f"{config.API_V1_STR}/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user."""

    # Check if user exists
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = AuthenticationService.hash_password(req.password)
    user = User(
        email=req.email,
        full_name=req.full_name,
        hashed_password=hashed_password,
        phone=req.phone,
        role=UserRole.BUYER,
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    logger.info(f"✅ User registered: {user.email}")

    return user


@app.post(f"{config.API_V1_STR}/auth/login", response_model=TokenResponse)
async def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    """Login user and get access token."""

    # Find user
    user = db.query(User).filter(User.email == req.email).first()

    if not user or not AuthenticationService.verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Create tokens
    access_token = AuthenticationService.create_access_token(user.id, user.email)
    refresh_token = AuthenticationService.create_refresh_token(user.id, user.email)

    logger.info(f"✅ User logged in: {user.email}")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user,
    }


@app.get(f"{config.API_V1_STR}/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return current_user


# ============================================================================
# Property Endpoints - List & Search
# ============================================================================

@app.get(f"{config.API_V1_STR}/properties", response_model=PropertyListResponse)
async def list_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    property_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None,
    city: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List properties with optional filtering and search."""

    query = db.query(Property).filter(Property.is_active == True)

    # Search by title and description
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Property.title.ilike(search_term),
                Property.description.ilike(search_term),
                Property.address.ilike(search_term),
            )
        )

    # Filter by property type
    if property_type:
        query = query.filter(Property.property_type == property_type)

    # Filter by price range
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)

    # Filter by bedrooms
    if bedrooms is not None:
        query = query.filter(Property.bedrooms == bedrooms)

    # Filter by city
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))

    # Get total count
    total = query.count()

    # Get paginated results
    properties = query.offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = math.ceil(total / limit) if limit > 0 else 1

    return {
        "items": properties,
        "total": total,
        "page": skip // limit + 1 if limit > 0 else 1,
        "page_size": limit,
        "total_pages": total_pages,
    }


@app.get(f"{config.API_V1_STR}/properties/{{property_id}}", response_model=PropertyResponse)
async def get_property(property_id: int, db: Session = Depends(get_db)):
    """Get property details."""

    prop = db.query(Property).filter(Property.id == property_id).first()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    # Increment view count
    prop.views_count += 1
    db.commit()

    return prop


# ============================================================================
# Property Management - Create, Update, Delete
# ============================================================================

@app.post(f"{config.API_V1_STR}/properties", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
    req: PropertyCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new property listing."""

    # Only sellers and agents can create properties
    if current_user.role not in [UserRole.SELLER, UserRole.AGENT_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only sellers and agents can create properties"
        )

    # If agent, must be verified
    if current_user.role == UserRole.AGENT_ADMIN and not current_user.is_agent_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent must be verified before listing properties"
        )

    # Create property
    prop = Property(
        title=req.title,
        description=req.description,
        property_type=req.property_type,
        price=req.price,
        address=req.address,
        city=req.city,
        emirate=req.emirate,
        bedrooms=req.bedrooms,
        bathrooms=req.bathrooms,
        area_sqft=req.area_sqft,
        furnishing=req.furnishing,
        owner_id=current_user.id,
        is_active=True,
    )

    db.add(prop)
    db.commit()
    db.refresh(prop)

    logger.info(f"✅ Property created: {prop.title} (ID: {prop.id})")

    return prop


@app.put(f"{config.API_V1_STR}/properties/{{property_id}}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    req: PropertyCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a property listing."""

    prop = db.query(Property).filter(Property.id == property_id).first()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    # Only owner can update
    if prop.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own properties"
        )

    # Update fields
    prop.title = req.title
    prop.description = req.description
    prop.property_type = req.property_type
    prop.price = req.price
    prop.address = req.address
    prop.city = req.city
    prop.emirate = req.emirate
    prop.bedrooms = req.bedrooms
    prop.bathrooms = req.bathrooms
    prop.area_sqft = req.area_sqft
    prop.furnishing = req.furnishing

    db.commit()
    db.refresh(prop)

    logger.info(f"✅ Property updated: {prop.title} (ID: {prop.id})")

    return prop


@app.delete(f"{config.API_V1_STR}/properties/{{property_id}}")
async def delete_property(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a property listing."""

    prop = db.query(Property).filter(Property.id == property_id).first()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    # Only owner can delete
    if prop.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own properties"
        )

    db.delete(prop)
    db.commit()

    logger.info(f"✅ Property deleted: ID {property_id}")

    return {"message": "Property deleted successfully"}


# ============================================================================
# User Dashboard Endpoints
# ============================================================================

@app.get(f"{config.API_V1_STR}/users/me/properties", response_model=PropertyListResponse)
async def get_my_properties(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's properties."""

    properties = db.query(Property).filter(Property.owner_id == current_user.id).all()

    return {
        "items": properties,
        "total": len(properties),
        "page": 1,
        "page_size": 100,
    }


@app.get(f"{config.API_V1_STR}/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Get platform statistics."""

    total_properties = db.query(Property).filter(Property.is_active == True).count()
    total_users = db.query(User).count()
    total_agents = db.query(User).filter(User.role == UserRole.AGENT_ADMIN).count()

    return {
        "total_properties": total_properties,
        "total_users": total_users,
        "total_agents": total_agents,
        "platform": "gulfvista.properties",
    }


# ============================================================================
# Job Status Endpoints (Phase 5)
# ============================================================================

@app.get(f"{config.API_V1_STR}/jobs/status")
async def get_jobs_status(current_user: User = Depends(get_current_user)):
    """Get status of background jobs (admin only)."""

    # Only admins can view job status
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can view job status"
        )

    return get_job_status()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
