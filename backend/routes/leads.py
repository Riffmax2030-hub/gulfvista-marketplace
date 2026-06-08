"""
Lead management endpoints for gulfvista.properties.
Handles lead CRUD, assignment, and status updates.
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import Lead, User, UserRole
from schemas import (
    LeadCreate, LeadUpdate, LeadResponse, LeadListResponse, LeadAssignRequest
)
from services import LeadService
from auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/leads")


# ============================================================================
# Lead Creation
# ============================================================================

@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    req: LeadCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new lead/inquiry for a property.
    Auto-assigns to agent with fewest pending leads.
    """
    try:
        lead_service = LeadService(db)

        lead = lead_service.create_lead(
            property_id=req.property_id,
            inquirer_name=req.inquirer_name,
            inquirer_email=req.inquirer_email,
            inquirer_phone=req.inquirer_phone,
            message=req.message,
            source=req.source if hasattr(req, 'source') else None,
            agent_id=req.agent_id,  # None = auto-assign
        )

        logger.info(f"✅ Created lead {lead.id} for property {req.property_id}")

        return lead

    except Exception as e:
        logger.error(f"Error creating lead: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Lead Listing & Retrieval
# ============================================================================

@router.get("", response_model=LeadListResponse)
async def list_leads(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = None,
    agent_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List leads.
    - Agents see only their own leads
    - Admins see all leads
    """
    query = db.query(Lead)

    # Filter by agent
    if current_user.role == UserRole.AGENT_ADMIN:
        # Agents see only their leads
        query = query.filter(Lead.agent_id == current_user.id)
    elif agent_id and current_user.is_superuser:
        # Admins can filter by specific agent
        query = query.filter(Lead.agent_id == agent_id)

    # Filter by status
    if status_filter:
        query = query.filter(Lead.status == status_filter)

    # Count total
    total = query.count()

    # Paginate
    leads = query.order_by(Lead.created_at.desc()).offset(skip).limit(limit).all()

    logger.info(f"📋 Listed {len(leads)} leads for user {current_user.id}")

    return {
        "items": leads,
        "total": total,
        "page": (skip // limit) + 1 if limit > 0 else 1,
        "page_size": limit,
    }


@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get lead details by ID."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    # Authorization: agent sees only their leads, admin sees all
    if current_user.role == UserRole.AGENT_ADMIN and lead.agent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own leads"
        )

    return lead


# ============================================================================
# Lead Status Management
# ============================================================================

@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    req: LeadUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update lead status, assignment, or notes."""
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()

        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )

        # Authorization
        if current_user.role == UserRole.AGENT_ADMIN and lead.agent_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own leads"
            )

        lead_service = LeadService(db)

        # Update status
        if req.status:
            lead = lead_service.update_lead_status(lead_id, req.status, req.notes)

        # Update other fields if provided
        if req.agent_id and current_user.is_superuser:
            lead = lead_service.reassign_lead(lead_id, req.agent_id)

        if req.follow_up_count is not None:
            lead.follow_up_count = req.follow_up_count

        if req.last_contacted_at:
            lead.last_contacted_at = req.last_contacted_at

        db.commit()
        db.refresh(lead)

        logger.info(f"✏️  Updated lead {lead_id}")

        return lead

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating lead: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/{lead_id}/mark-converted")
async def mark_lead_converted(
    lead_id: int,
    conversion_value: Optional[float] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a lead as converted."""
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()

        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )

        # Authorization
        if current_user.role == UserRole.AGENT_ADMIN and lead.agent_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own leads"
            )

        lead_service = LeadService(db)
        lead = lead_service.mark_converted(lead_id, conversion_value)

        logger.info(f"💰 Lead {lead_id} marked as converted (value: {conversion_value})")

        return {
            "message": "Lead marked as converted",
            "lead": lead,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking lead as converted: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Lead Communication
# ============================================================================

@router.post("/{lead_id}/log-contact")
async def log_contact(
    lead_id: int,
    action: str,
    details: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Log a communication action for a lead.
    Actions: contacted, emailed, called, viewed
    """
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()

        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )

        # Authorization
        if current_user.role == UserRole.AGENT_ADMIN and lead.agent_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only log contact on your own leads"
            )

        lead_service = LeadService(db)
        lead = lead_service.log_communication(lead_id, action, details)

        logger.info(f"📋 Logged {action} for lead {lead_id}")

        return {
            "message": f"Contact logged: {action}",
            "lead": lead,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging contact: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Lead Assignment (Admin Only)
# ============================================================================

@router.post("/{lead_id}/assign")
async def assign_lead(
    lead_id: int,
    req: LeadAssignRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Assign lead to a specific agent (admin only)."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can assign leads"
        )

    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()

        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )

        lead_service = LeadService(db)
        lead = lead_service.reassign_lead(lead_id, req.agent_id)

        logger.info(f"🔄 Assigned lead {lead_id} to agent {req.agent_id}")

        return {
            "message": f"Lead assigned to agent {req.agent_id}",
            "lead": lead,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error assigning lead: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Lead Statistics
# ============================================================================

@router.get("/stats/summary")
async def get_lead_stats(
    db: Session = Depends(get_db),
):
    """Get overall lead statistics."""
    try:
        lead_service = LeadService(db)
        stats = lead_service.get_lead_stats()

        return stats

    except Exception as e:
        logger.error(f"Error fetching lead stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
