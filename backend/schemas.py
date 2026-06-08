"""
Pydantic schemas for request/response validation in gulfvista.properties API.
Ensures type safety and data validation across all endpoints.
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum
from models import UserRole, PropertyType, PaymentStatus, LeadStatus, LeadSource, AgentStatus


# ============================================================================
# Auth Schemas
# ============================================================================

class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Decoded JWT token data."""
    user_id: int
    email: str


# ============================================================================
# User Schemas
# ============================================================================

class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    full_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user registration."""
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.BUYER


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserProfileUpdate(BaseModel):
    """Schema for updating user profile."""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    company_logo_url: Optional[str] = None
    bio: Optional[str] = None


class UserResponse(UserBase):
    """User response schema (no sensitive data)."""
    id: int
    role: UserRole
    is_agent_verified: bool
    company_name: Optional[str] = None
    company_logo_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AgentProfileResponse(UserResponse):
    """Extended agent profile response."""
    is_superuser: bool
    total_listings: int = 0
    total_leads: int = 0


# ============================================================================
# Property Schemas
# ============================================================================

class PropertyImageSchema(BaseModel):
    """Schema for property images."""
    url: str
    alt_text: Optional[str] = None
    display_order: int = 0


class PropertyCreate(BaseModel):
    """Schema for creating a property."""
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=20)
    property_type: PropertyType
    price: float = Field(..., gt=0)
    address: str
    city: str
    emirate: str
    country: str = "UAE"
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqft: Optional[float] = None
    year_built: Optional[int] = None
    furnishing: Optional[str] = None
    images: List[str] = Field(default_factory=list)
    video_url: Optional[str] = None
    floor_plans: List[str] = Field(default_factory=list)
    developer_name: Optional[str] = None
    project_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class PropertyUpdate(BaseModel):
    """Schema for updating a property."""
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqft: Optional[float] = None


class PropertyResponse(BaseModel):
    """Property response schema."""
    id: int
    title: str
    description: str
    property_type: PropertyType
    price: float
    currency: str
    address: str
    city: str
    emirate: str
    country: str
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqft: Optional[float] = None
    year_built: Optional[int] = None
    furnishing: Optional[str] = None
    images: List[str]
    video_url: Optional[str] = None
    floor_plans: List[str]
    developer_name: Optional[str] = None
    project_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: bool
    is_featured: bool
    views_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PropertyDetailResponse(PropertyResponse):
    """Extended property detail response."""
    owner: Optional[UserResponse] = None
    owner_id: Optional[int] = None


class PropertyListResponse(BaseModel):
    """Property list with pagination."""
    items: List[PropertyResponse]
    total: int
    page: int
    page_size: int
    total_pages: int = 0  # Optional - calculated by frontend if needed


# ============================================================================
# Payment Schemas
# ============================================================================

class CreateCheckoutSessionRequest(BaseModel):
    """Request to create a Stripe checkout session."""
    success_url: str = Field(..., description="URL to redirect after successful payment")
    cancel_url: str = Field(..., description="URL to redirect if user cancels")


class CreateCheckoutSessionResponse(BaseModel):
    """Response with checkout session details."""
    session_id: str
    client_secret: Optional[str] = None
    url: Optional[str] = None


class PaymentVerification(BaseModel):
    """Payment verification webhook data."""
    stripe_session_id: str
    status: PaymentStatus


class TransactionResponse(BaseModel):
    """Transaction response schema."""
    id: int
    user_id: int
    stripe_session_id: str
    amount_cents: int
    currency: str
    transaction_type: str
    status: PaymentStatus
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================================
# Lead Schemas (Phase 5: Enhanced)
# ============================================================================

class LeadCreate(BaseModel):
    """Schema for creating a lead/inquiry."""
    property_id: int = Field(..., gt=0)
    inquirer_name: str = Field(..., min_length=2, max_length=255)
    inquirer_email: EmailStr
    inquirer_phone: str = Field(..., min_length=7, max_length=20)
    message: Optional[str] = Field(None, max_length=1000)
    agent_id: Optional[int] = None  # Auto-assigned if not provided


class LeadUpdate(BaseModel):
    """Schema for updating a lead."""
    status: Optional[LeadStatus] = None
    agent_id: Optional[int] = None
    notes: Optional[str] = None
    follow_up_count: Optional[int] = Field(None, ge=0)
    last_contacted_at: Optional[datetime] = None


class CommunicationLogEntry(BaseModel):
    """Single communication log entry."""
    timestamp: datetime
    action: str  # contacted, emailed, called, viewed
    details: Optional[str] = None


class LeadResponse(BaseModel):
    """Lead response schema."""
    id: int
    agent_id: int
    property_id: int
    inquirer_name: str
    inquirer_email: str
    inquirer_phone: str
    message: Optional[str] = None
    inquiry_date: datetime
    status: LeadStatus
    assigned_at: Optional[datetime] = None
    last_contacted_at: Optional[datetime] = None
    follow_up_count: int = 0
    converted_at: Optional[datetime] = None
    conversion_value: Optional[float] = None
    source: LeadSource = LeadSource.PROPERTY_INQUIRY
    notes: Optional[str] = None
    communication_log: List[CommunicationLogEntry] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LeadListResponse(BaseModel):
    """Lead list with pagination."""
    items: List[LeadResponse]
    total: int
    page: int
    page_size: int


class LeadAssignRequest(BaseModel):
    """Schema for assigning a lead to an agent."""
    agent_id: int = Field(..., gt=0)


# ============================================================================
# Agent Schemas (Phase 5)
# ============================================================================

class AgentStatsResponse(BaseModel):
    """Agent statistics response."""
    agent_id: int
    total_listings: int = 0
    active_listings: int = 0
    total_leads: int = 0
    converted_leads: int = 0
    pending_leads: int = 0
    response_time_hours: float = 0.0
    conversion_rate: float = 0.0
    average_deal_value: Optional[float] = None
    last_updated: datetime

    class Config:
        from_attributes = True


class AgentDetailResponse(UserResponse):
    """Extended agent profile with statistics."""
    stats: Optional[AgentStatsResponse] = None


class AgentListResponse(BaseModel):
    """Agent list with pagination."""
    items: List[UserResponse]
    total: int
    page: int
    page_size: int


# ============================================================================
# Property Sync Schemas (Phase 5)
# ============================================================================

class PropertySyncLogResponse(BaseModel):
    """Property sync operation log."""
    id: int
    sync_type: str  # full, incremental, manual
    status: str  # pending, in_progress, completed, failed
    started_at: datetime
    completed_at: Optional[datetime] = None
    total_processed: int = 0
    created_count: int = 0
    updated_count: int = 0
    deleted_count: int = 0
    error_details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PropertySyncListResponse(BaseModel):
    """Property sync logs with pagination."""
    items: List[PropertySyncLogResponse]
    total: int
    page: int
    page_size: int


class PropertySyncTriggerRequest(BaseModel):
    """Request to trigger manual property sync."""
    sync_type: str = "manual"  # full, incremental, manual


class PropertySyncTriggerResponse(BaseModel):
    """Response from sync trigger."""
    sync_id: int
    status: str
    message: str


class PropertySourceInfo(BaseModel):
    """Information about property source (Reelly, etc.)."""
    source_id: Optional[str] = None
    source_platform: Optional[str] = None
    last_synced_at: Optional[datetime] = None
    is_synced: bool = False


# ============================================================================
# Reelly Webhook Schemas (Phase 5)
# ============================================================================

class ReelyWebhookPayload(BaseModel):
    """Inbound Reelly webhook payload."""
    event_id: str
    event_type: str  # property.created, property.updated, property.deleted
    timestamp: datetime
    data: Dict[str, Any] = {}


class ReelyWebhookResponse(BaseModel):
    """Response to webhook receipt."""
    status: str  # accepted, rejected
    message: str
    event_id: Optional[str] = None


# ============================================================================
# Error Response Schemas
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.now)


class ValidationError(BaseModel):
    """Validation error response."""
    detail: List[dict]
    status_code: int = 422
