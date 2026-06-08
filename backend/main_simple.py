"""
FastAPI application for gulfvista.properties - Simplified Working Version
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import config

# Create FastAPI app
app = FastAPI(
    title=config.APP_NAME,
    description="Premium Real Estate Marketplace API",
    version="1.0.0",
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


# ============================================================================
# Health & Status Endpoints
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": config.APP_NAME,
        "version": "1.0.0",
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to gulfvista.properties API",
        "docs": "/api/docs",
        "health": "/health",
    }


# ============================================================================
# API V1 - Demo Endpoints
# ============================================================================

@app.get(f"{config.API_V1_STR}/status")
async def api_status():
    """API status endpoint."""
    return {
        "service": "gulfvista API",
        "status": "operational",
    }


# ============================================================================
# Authentication Endpoints (Demo)
# ============================================================================

@app.post(f"{config.API_V1_STR}/auth/register")
async def register(email: str, password: str, full_name: str):
    """Register a new user."""
    return {
        "id": 1,
        "email": email,
        "full_name": full_name,
        "role": "buyer",
    }


@app.post(f"{config.API_V1_STR}/auth/login")
async def login(email: str, password: str):
    """Login user."""
    return {
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
        "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
        "token_type": "bearer",
    }


@app.get(f"{config.API_V1_STR}/auth/me")
async def get_current_user():
    """Get current user."""
    return {
        "id": 1,
        "email": "agent@gulfvista.properties",
        "full_name": "Test Agent",
        "role": "agent_admin",
    }


# ============================================================================
# Properties Endpoints (Demo)
# ============================================================================

@app.get(f"{config.API_V1_STR}/properties")
async def list_properties():
    """List properties."""
    return {
        "items": [
            {
                "id": 1,
                "title": "Luxury Villa in Dubai",
                "price": 3500000.0,
                "currency": "AED",
                "address": "Arabian Ranches, Dubai",
                "property_type": "villa",
                "bedrooms": 4,
            },
            {
                "id": 2,
                "title": "Modern Apartment in Marina",
                "price": 1800000.0,
                "currency": "AED",
                "address": "Dubai Marina, Dubai",
                "property_type": "apartment",
                "bedrooms": 2,
            },
        ],
        "total": 2,
        "page": 1,
    }


@app.get(f"{config.API_V1_STR}/properties/{{property_id}}")
async def get_property(property_id: int):
    """Get property details."""
    return {
        "id": property_id,
        "title": "Luxury Property",
        "price": 2500000.0,
        "currency": "AED",
        "address": "Downtown Dubai",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
