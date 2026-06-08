"""
Property management endpoints for gulfvista.properties.
Handles property CRUD, search, and Reelly sync operations.
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from database import get_db
from models import Property, PropertySyncLog, User
from schemas import PropertyResponse, PropertyListResponse, PropertyCreate
from services import PropertySyncService
from auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/properties")


# ============================================================================
# Property Listing & Search
# ============================================================================

@router.get("", response_model=PropertyListResponse)
async def list_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    property_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None,
    city: Optional[str] = None,
    source: Optional[str] = None,  # Filter by source (reelly, manual, etc)
    db: Session = Depends(get_db),
):
    """
    List properties with filtering and search.

    Query Parameters:
    - search: Search in title, description, address
    - property_type: Filter by type (apartment, villa, etc)
    - min_price/max_price: Price range filter
    - bedrooms: Filter by bedroom count
    - city: Filter by city
    - source: Filter by source platform (reelly, manual)
    """
    query = db.query(Property).filter(Property.is_active == True)

    # Search
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Property.title.ilike(search_term),
                Property.description.ilike(search_term),
                Property.address.ilike(search_term),
            )
        )

    # Filters
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if bedrooms is not None:
        query = query.filter(Property.bedrooms == bedrooms)
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if source:
        query = query.filter(Property.source_platform == source)

    # Count total
    total = query.count()

    # Paginate
    properties = query.order_by(Property.created_at.desc()).offset(skip).limit(limit).all()

    logger.info(f"📋 Listed {len(properties)} properties (total: {total})")

    return {
        "items": properties,
        "total": total,
        "page": (skip // limit) + 1 if limit > 0 else 1,
        "page_size": limit,
    }


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: int, db: Session = Depends(get_db)):
    """Get property details by ID."""
    prop = db.query(Property).filter(Property.id == property_id).first()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    # Increment view count
    prop.views_count += 1
    db.commit()

    logger.info(f"👁️  Property {property_id} viewed (views: {prop.views_count})")

    return prop


# ============================================================================
# Property Management (Create, Update, Delete)
# ============================================================================

@router.post("", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
    req: PropertyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new property listing."""
    from models import UserRole

    # Only sellers and agents can create
    if current_user.role not in [UserRole.SELLER, UserRole.AGENT_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only sellers and agents can create properties"
        )

    prop = Property(
        title=req.title,
        description=req.description,
        property_type=req.property_type,
        price=req.price,
        address=req.address,
        city=req.city,
        emirate=req.emirate,
        country=req.country,
        bedrooms=req.bedrooms,
        bathrooms=req.bathrooms,
        area_sqft=req.area_sqft,
        year_built=req.year_built,
        furnishing=req.furnishing,
        images=req.images,
        video_url=req.video_url,
        floor_plans=req.floor_plans,
        developer_name=req.developer_name,
        project_name=req.project_name,
        latitude=req.latitude,
        longitude=req.longitude,
        owner_id=current_user.id,
        is_active=True,
    )

    db.add(prop)
    db.commit()
    db.refresh(prop)

    logger.info(f"✅ Created property {prop.id}: {prop.title}")

    return prop


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    req: PropertyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update property details."""
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

    # Update fields if provided
    if req.title is not None:
        prop.title = req.title
    if req.description is not None:
        prop.description = req.description
    if req.price is not None:
        prop.price = req.price
    if req.is_active is not None:
        prop.is_active = req.is_active
    if req.is_featured is not None:
        prop.is_featured = req.is_featured
    if req.bedrooms is not None:
        prop.bedrooms = req.bedrooms
    if req.bathrooms is not None:
        prop.bathrooms = req.bathrooms
    if req.area_sqft is not None:
        prop.area_sqft = req.area_sqft

    db.commit()
    db.refresh(prop)

    logger.info(f"✏️  Updated property {property_id}")

    return prop


@router.delete("/{property_id}")
async def delete_property(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete property listing."""
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

    logger.info(f"🗑️  Deleted property {property_id}")

    return {"message": "Property deleted successfully"}


# ============================================================================
# Reelly Sync Management
# ============================================================================

@router.post("/sync/trigger")
async def trigger_property_sync(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Manually trigger property sync from Reelly.
    Admin only.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can trigger syncs"
        )

    try:
        sync_service = PropertySyncService(db)

        # Log sync start
        sync_log = sync_service.log_sync(
            sync_type="manual",
            status="in_progress",
            stats={"total_processed": 0},
        )

        logger.info(f"🚀 Manual sync triggered by admin {current_user.id}")

        return {
            "status": "started",
            "sync_id": sync_log.id,
            "message": "Property sync started. Check /sync/status/{sync_id} for progress"
        }

    except Exception as e:
        logger.error(f"Error triggering sync: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/sync/status")
async def get_sync_status(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Get recent property sync history."""
    try:
        syncs = db.query(PropertySyncLog).order_by(
            PropertySyncLog.created_at.desc()
        ).limit(limit).all()

        return {
            "syncs": [
                {
                    "id": s.id,
                    "sync_type": s.sync_type,
                    "status": s.status,
                    "created": s.created_count,
                    "updated": s.updated_count,
                    "total": s.total_processed,
                    "error": s.error_details,
                    "completed_at": s.completed_at.isoformat() if s.completed_at else None,
                }
                for s in syncs
            ]
        }

    except Exception as e:
        logger.error(f"Error fetching sync status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/sync/status/{sync_id}")
async def get_sync_details(sync_id: int, db: Session = Depends(get_db)):
    """Get detailed sync operation status."""
    sync_log = db.query(PropertySyncLog).filter(PropertySyncLog.id == sync_id).first()

    if not sync_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sync operation not found"
        )

    return {
        "id": sync_log.id,
        "sync_type": sync_log.sync_type,
        "status": sync_log.status,
        "statistics": {
            "total_processed": sync_log.total_processed,
            "created": sync_log.created_count,
            "updated": sync_log.updated_count,
            "deleted": sync_log.deleted_count,
        },
        "timing": {
            "started_at": sync_log.started_at.isoformat(),
            "completed_at": sync_log.completed_at.isoformat() if sync_log.completed_at else None,
        },
        "error_details": sync_log.error_details,
    }
