"""
SQLAlchemy ORM models for gulfvista.properties.
Defines the core data structures for users, properties, and transactions.
"""

from datetime import datetime, UTC
from sqlalchemy import (
    Column, String, Integer, Float, DateTime, Boolean, Text, Enum, ForeignKey, JSON, Index
)
from sqlalchemy.orm import relationship
import enum
from database import Base


class UserRole(str, enum.Enum):
    """User role enumeration."""
    BUYER = "buyer"
    SELLER = "seller"
    AGENT_PENDING = "agent_pending"
    AGENT_ADMIN = "agent_admin"


class PropertyType(str, enum.Enum):
    """Property type enumeration."""
    APARTMENT = "apartment"
    VILLA = "villa"
    TOWNHOUSE = "townhouse"
    LAND = "land"
    COMMERCIAL = "commercial"
    OFFICE = "office"


class PaymentStatus(str, enum.Enum):
    """Payment status enumeration."""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class LeadStatus(str, enum.Enum):
    """Lead status enumeration."""
    NEW = "new"
    CONTACTED = "contacted"
    INTERESTED = "interested"
    NEGOTIATING = "negotiating"
    CONVERTED = "converted"
    LOST = "lost"
    CANCELLED = "cancelled"


class AgentStatus(str, enum.Enum):
    """Agent account status enumeration."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    ONBOARDING = "onboarding"


class LeadSource(str, enum.Enum):
    """Lead source enumeration."""
    WEB_FORM = "web_form"
    PROPERTY_INQUIRY = "property_inquiry"
    REELLY_WEBHOOK = "reelly_webhook"
    MANUAL = "manual"


class User(Base):
    """User model for all platform users."""
    __tablename__ = "users"
    __table_args__ = (
        # NOTE: Do NOT add Index("ix_users_email", "email") here - email column already has unique=True
        # which automatically creates the necessary index. Multiple index definitions cause errors.
        Index("ix_users_role", "role"),
    )

    id = Column(Integer, primary_key=True, index=True)
    # NOTE: unique=True automatically creates an index - do NOT add index=True or Index() definition
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)

    # User profile
    role = Column(Enum(UserRole), default=UserRole.BUYER, nullable=False)
    company_name = Column(String(255), nullable=True)  # For agents
    company_logo_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)

    # Payment verification
    is_agent_verified = Column(Boolean, default=False)  # True if agent_admin
    stripe_customer_id = Column(String(255), nullable=True, unique=True)

    # Account status
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.now(UTC), onupdate=datetime.now(UTC), nullable=False)

    # Relationships
    properties = relationship("Property", back_populates="owner")
    transactions = relationship("Transaction", back_populates="user")
    leads = relationship("Lead", back_populates="agent")


class Property(Base):
    """Property listing model."""
    __tablename__ = "properties"
    __table_args__ = (
        Index("ix_properties_owner_id", "owner_id"),
        Index("ix_properties_source_id", "source_id"),
        Index("ix_properties_type", "property_type"),
        # NOTE: Do NOT add duplicate indices here for columns that already have index=True
    )

    id = Column(Integer, primary_key=True, index=True)

    # Basic info
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    # NOTE: property_type has index=True - do NOT add duplicate Index() in __table_args__
    property_type = Column(Enum(PropertyType), nullable=False, index=True)

    # Pricing
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="AED", nullable=False)
    price_per_sqft = Column(Float, nullable=True)

    # Location
    address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False)
    emirate = Column(String(100), nullable=False)  # For GCC context
    country = Column(String(100), default="UAE", nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Property details
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    area_sqft = Column(Float, nullable=True)
    year_built = Column(Integer, nullable=True)
    furnishing = Column(String(50), nullable=True)  # furnished, unfurnished, semi-furnished

    # Media
    images = Column(JSON, default=list, nullable=False)  # Array of image URLs
    video_url = Column(String(500), nullable=True)
    floor_plans = Column(JSON, default=list, nullable=False)  # Array of floor plan URLs

    # Developer/Project info
    developer_name = Column(String(255), nullable=True)
    project_name = Column(String(255), nullable=True)
    developer_logo_url = Column(String(500), nullable=True)

    # Data integration
    source_id = Column(Integer, nullable=True, unique=True)  # Reelly API ID (integer from Reelly v2.0)
    source_platform = Column(String(50), default="reelly", nullable=False)

    # Listing control
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    views_count = Column(Integer, default=0)

    # Ownership
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.now(UTC), onupdate=datetime.now(UTC), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="properties")
    leads = relationship("Lead", back_populates="property")


class Transaction(Base):
    """Transaction/Payment record model."""
    __tablename__ = "transactions"
    __table_args__ = (
        Index("ix_transactions_user_id", "user_id"),
        Index("ix_transactions_status", "status"),
        Index("ix_transactions_created_at", "created_at"),
    )

    id = Column(Integer, primary_key=True, index=True)

    # User reference
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Payment details
    stripe_session_id = Column(String(255), unique=True, nullable=False)
    stripe_payment_intent_id = Column(String(255), nullable=True, unique=True)
    amount_cents = Column(Integer, nullable=False)  # Amount in cents
    currency = Column(String(3), default="USD", nullable=False)

    # Transaction type
    transaction_type = Column(String(50), default="agent_registration", nullable=False)
    description = Column(String(500), nullable=False)

    # Status tracking
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)

    # Payment verification
    idempotency_key = Column(String(255), nullable=True, unique=True)

    # Payment metadata
    payment_metadata = Column(JSON, default=dict, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.now(UTC), onupdate=datetime.now(UTC), nullable=False)

    # Relationships
    user = relationship("User", back_populates="transactions")


class PropertySyncLog(Base):
    """Audit trail for property synchronization operations."""
    __tablename__ = "property_sync_logs"
    __table_args__ = (
        Index("ix_property_sync_logs_status", "status"),
        Index("ix_property_sync_logs_created_at", "created_at"),
    )

    id = Column(Integer, primary_key=True, index=True)

    # Sync information
    sync_type = Column(String(50), nullable=False)  # full, incremental, manual
    status = Column(String(50), default="pending", nullable=False)  # pending, in_progress, completed, failed

    # Timing
    started_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Statistics
    total_processed = Column(Integer, default=0, nullable=False)
    created_count = Column(Integer, default=0, nullable=False)
    updated_count = Column(Integer, default=0, nullable=False)
    deleted_count = Column(Integer, default=0, nullable=False)

    # Error tracking
    error_details = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)


class AgentStats(Base):
    """Denormalized agent statistics for performance."""
    __tablename__ = "agent_stats"
    __table_args__ = (
        Index("ix_agent_stats_agent_id", "agent_id"),
        Index("ix_agent_stats_last_updated", "last_updated"),
    )

    id = Column(Integer, primary_key=True, index=True)

    # Agent reference
    agent_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Statistics
    total_listings = Column(Integer, default=0, nullable=False)
    active_listings = Column(Integer, default=0, nullable=False)
    total_leads = Column(Integer, default=0, nullable=False)
    converted_leads = Column(Integer, default=0, nullable=False)
    pending_leads = Column(Integer, default=0, nullable=False)

    # Performance metrics
    response_time_hours = Column(Float, default=0.0, nullable=False)
    conversion_rate = Column(Float, default=0.0, nullable=False)  # percentage
    average_deal_value = Column(Float, nullable=True)

    # Timestamps
    last_updated = Column(DateTime(timezone=True), default=datetime.now(UTC), onupdate=datetime.now(UTC), nullable=False)


class ReelyWebhook(Base):
    """Inbound webhook events from Reelly API."""
    __tablename__ = "reely_webhooks"
    __table_args__ = (
        Index("ix_reely_webhooks_event_id", "reely_event_id"),
        Index("ix_reely_webhooks_event_type", "event_type"),
        Index("ix_reely_webhooks_received_at", "received_at"),
    )

    id = Column(Integer, primary_key=True, index=True)

    # Webhook event information
    reely_event_id = Column(String(255), unique=True, nullable=False)
    event_type = Column(String(100), nullable=False)  # property.created, property.updated, property.deleted

    # Payload and processing
    payload = Column(JSON, nullable=False)  # Full webhook payload
    processed = Column(Boolean, default=False, nullable=False)

    # Error tracking
    error_details = Column(Text, nullable=True)

    # Timestamps
    received_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)
    processed_at = Column(DateTime(timezone=True), nullable=True)


class WebhookLog(Base):
    """Stripe webhook event log for audit trail and debugging."""
    __tablename__ = "webhook_logs"
    __table_args__ = (
        Index("ix_webhook_logs_event_id", "stripe_event_id"),
        Index("ix_webhook_logs_event_type", "event_type"),
        Index("ix_webhook_logs_received_at", "received_at"),
    )

    id = Column(Integer, primary_key=True, index=True)

    # Webhook event information
    stripe_event_id = Column(String(255), unique=True, nullable=False)
    event_type = Column(String(100), nullable=False)  # e.g., checkout.session.completed

    # Payload and processing
    payload = Column(JSON, nullable=False)  # Full webhook payload
    processed = Column(Boolean, default=False, nullable=False)

    # Error tracking
    error_details = Column(Text, nullable=True)  # Error message if processing failed

    # Timestamps
    received_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)
    processed_at = Column(DateTime(timezone=True), nullable=True)


class Invoice(Base):
    """Invoice/Receipt model for payment records."""
    __tablename__ = "invoices"
    __table_args__ = (
        Index("ix_invoices_transaction_id", "transaction_id"),
        Index("ix_invoices_user_id", "user_id"),
        Index("ix_invoices_created_at", "created_at"),
    )

    id = Column(Integer, primary_key=True, index=True)

    # References
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Invoice details
    invoice_number = Column(String(50), unique=True, nullable=False)
    amount_cents = Column(Integer, nullable=False)
    currency = Column(String(3), default="USD", nullable=False)

    # Invoice content
    description = Column(String(500), nullable=False)
    pdf_url = Column(String(500), nullable=True)  # URL to PDF invoice

    # Timestamps
    issued_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)


class Lead(Base):
    """Lead/Inquiry model for property inquiries and lead management."""
    __tablename__ = "leads"
    __table_args__ = (
        Index("ix_leads_agent_id", "agent_id"),
        Index("ix_leads_property_id", "property_id"),
        Index("ix_leads_status", "status"),
        Index("ix_leads_created_at", "created_at"),
        # NOTE: Do NOT add Index("ix_leads_inquirer_email", "inquirer_email") - column has index=True
    )

    id = Column(Integer, primary_key=True, index=True)

    # Contact references
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)

    # Lead information
    inquirer_name = Column(String(255), nullable=False)
    # NOTE: Has index=True - do NOT add duplicate Index() in __table_args__
    inquirer_email = Column(String(255), nullable=False)
    inquirer_phone = Column(String(20), nullable=False)
    message = Column(Text, nullable=True)
    inquiry_date = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)

    # Lead tracking
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW, nullable=False)
    assigned_at = Column(DateTime(timezone=True), nullable=True)
    last_contacted_at = Column(DateTime(timezone=True), nullable=True)
    follow_up_count = Column(Integer, default=0, nullable=False)

    # Conversion tracking
    converted_at = Column(DateTime(timezone=True), nullable=True)
    conversion_value = Column(Float, nullable=True)  # Deal amount if converted

    # Lead source
    source = Column(Enum(LeadSource), default=LeadSource.PROPERTY_INQUIRY, nullable=False)

    # Communication tracking
    notes = Column(Text, nullable=True)
    communication_log = Column(JSON, default=list, nullable=False)  # Array of {timestamp, action, details}

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.now(UTC), onupdate=datetime.now(UTC), nullable=False)

    # Relationships
    agent = relationship("User", back_populates="leads")
    property = relationship("Property", back_populates="leads")
