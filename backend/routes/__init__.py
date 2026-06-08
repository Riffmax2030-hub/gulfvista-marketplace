"""
API routes module for gulfvista.properties.
Contains all REST endpoints organized by resource type.
"""

from fastapi import APIRouter
from .properties import router as properties_router
from .leads import router as leads_router
from .agents import router as agents_router
from .webhooks import router as webhooks_router

# Main router that includes all resource routers
api_router = APIRouter(prefix="/api/v1")

# Include all routers
api_router.include_router(properties_router, tags=["Properties"])
api_router.include_router(leads_router, tags=["Leads"])
api_router.include_router(agents_router, tags=["Agents"])
api_router.include_router(webhooks_router, tags=["Webhooks"])

__all__ = ["api_router"]
