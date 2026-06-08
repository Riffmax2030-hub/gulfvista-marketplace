"""
Agent management endpoints for gulfvista.properties.
Handles agent profiles, verification, and performance metrics.
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import User, UserRole, AgentStats
from schemas import UserResponse, AgentProfileResponse, AgentStatsResponse, AgentListResponse
from services import AgentService, LeadService
from auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/agents")


# ============================================================================
# Agent Discovery & Listing
# ============================================================================

@router.get("", response_model=AgentListResponse)
async def list_agents(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    verified_only: bool = Query(True),
    db: Session = Depends(get_db),
):
    """
    List available agents with their statistics.

    Query Parameters:
    - verified_only: Show only verified agents (default: true)
    """
    query = db.query(User).filter(
        User.role.in_([UserRole.AGENT_PENDING, UserRole.AGENT_ADMIN]),
        User.is_active == True,
    )

    if verified_only:
        query = query.filter(User.is_agent_verified == True)

    total = query.count()
    agents = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()

    logger.info(f"📋 Listed {len(agents)} agents")

    return {
        "items": agents,
        "total": total,
        "page": (skip // limit) + 1 if limit > 0 else 1,
        "page_size": limit,
    }


@router.get("/top-agents")
async def get_top_agents(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Get top agents by conversion rate."""
    try:
        agent_service = AgentService(db)
        top_agents = agent_service.get_top_agents(limit)

        logger.info(f"📊 Retrieved top {len(top_agents)} agents")

        return {
            "agents": top_agents,
            "limit": limit,
        }

    except Exception as e:
        logger.error(f"Error fetching top agents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Agent Profiles
# ============================================================================

@router.get("/{agent_id}", response_model=AgentProfileResponse)
async def get_agent_profile(
    agent_id: int,
    db: Session = Depends(get_db),
):
    """Get agent profile with statistics."""
    agent = db.query(User).filter(User.id == agent_id).first()

    if not agent or agent.role not in [UserRole.AGENT_PENDING, UserRole.AGENT_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    try:
        agent_service = AgentService(db)
        profile = agent_service.get_agent_profile(agent_id)

        logger.info(f"👤 Retrieved profile for agent {agent_id}")

        return profile

    except Exception as e:
        logger.error(f"Error fetching agent profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{agent_id}/stats", response_model=AgentStatsResponse)
async def get_agent_stats(
    agent_id: int,
    recalculate: bool = Query(False),
    db: Session = Depends(get_db),
):
    """
    Get agent performance statistics.

    Query Parameters:
    - recalculate: Force recalculation instead of using cached stats
    """
    try:
        agent_service = AgentService(db)

        # Recalculate if requested
        if recalculate:
            stats = agent_service.calculate_agent_stats(agent_id)
        else:
            stats = db.query(AgentStats).filter(
                AgentStats.agent_id == agent_id
            ).first()

            if not stats:
                # Calculate if not cached
                stats = agent_service.calculate_agent_stats(agent_id)

        if not stats:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent statistics not found"
            )

        logger.info(f"📊 Retrieved stats for agent {agent_id}")

        return stats

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching agent stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Agent Leads Management
# ============================================================================

@router.get("/{agent_id}/leads")
async def get_agent_leads(
    agent_id: int,
    status_filter: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get leads assigned to an agent.
    - Agents see only their own leads
    - Admins can see any agent's leads
    """
    # Authorization
    if current_user.role == UserRole.AGENT_ADMIN and agent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own leads"
        )

    try:
        lead_service = LeadService(db)
        leads = lead_service.get_agent_leads(
            agent_id,
            status=status_filter,
            limit=skip + limit
        )[skip:skip + limit]

        logger.info(f"📋 Retrieved {len(leads)} leads for agent {agent_id}")

        return {
            "leads": leads,
            "total": len(leads),
            "page": (skip // limit) + 1 if limit > 0 else 1,
            "page_size": limit,
        }

    except Exception as e:
        logger.error(f"Error fetching agent leads: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Network Statistics (Admin Only)
# ============================================================================

@router.get("/network/summary")
async def get_network_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get agent network performance summary (admin only)."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can view network summary"
        )

    try:
        agent_service = AgentService(db)
        summary = agent_service.get_performance_summary()

        logger.info("📊 Generated network summary")

        return summary

    except Exception as e:
        logger.error(f"Error generating network summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/stats/update-all")
async def update_all_agent_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update statistics for all agents (admin only)."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update agent stats"
        )

    try:
        agent_service = AgentService(db)
        result = agent_service.bulk_update_stats()

        logger.info(f"📊 Bulk stats update: {result}")

        return {
            "message": "Agent statistics updated",
            "result": result,
        }

    except Exception as e:
        logger.error(f"Error updating agent stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Agent Verification (Admin Only)
# ============================================================================

@router.post("/{agent_id}/verify")
async def verify_agent(
    agent_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verify an agent account (admin only)."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can verify agents"
        )

    try:
        agent_service = AgentService(db)
        user = agent_service.verify_agent(agent_id)

        logger.info(f"✅ Verified agent {agent_id}")

        return {
            "message": "Agent verified successfully",
            "agent": user,
        }

    except Exception as e:
        logger.error(f"Error verifying agent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Current User Agent Profile
# ============================================================================

@router.get("/me/profile", response_model=AgentProfileResponse)
async def get_my_agent_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's agent profile (if agent)."""
    if current_user.role not in [UserRole.AGENT_PENDING, UserRole.AGENT_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an agent to view this profile"
        )

    try:
        agent_service = AgentService(db)
        profile = agent_service.get_agent_profile(current_user.id)

        return profile

    except Exception as e:
        logger.error(f"Error fetching my agent profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
