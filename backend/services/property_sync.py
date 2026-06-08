"""
Property Sync Service for gulfvista.properties.
Handles syncing properties from Reelly API with deduplication and delta detection.
"""

import logging
from typing import Optional, Dict, List, Tuple
from datetime import datetime, UTC
from sqlalchemy.orm import Session
from models import Property, PropertySyncLog, PropertyType

logger = logging.getLogger(__name__)


class PropertySyncException(Exception):
    """Exception raised during property sync."""
    pass


class PropertySyncService:
    """
    Service for synchronizing properties from external sources (Reelly).
    Handles deduplication, delta detection, and sync logging.
    """

    def __init__(self, db: Session):
        """
        Initialize property sync service.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db

    def get_or_create_property(
        self,
        property_data: Dict,
        source_id: str,
        source_platform: str = "reelly",
    ) -> Tuple[Property, bool]:
        """
        Get existing property or create new one based on source_id.
        Handles deduplication using UNIQUE(source_id, source_platform) constraint.

        Args:
            property_data: Property details from source API
            source_id: Unique ID from source platform
            source_platform: Source platform name (default: reelly)

        Returns:
            Tuple of (Property object, is_new) - True if newly created
        """
        # Check if property exists by source_id
        existing = self.db.query(Property).filter(
            Property.source_id == source_id,
            Property.source_platform == source_platform,
        ).first()

        if existing:
            return existing, False

        # Create new property
        try:
            property_obj = Property(
                title=property_data.get("title", "Untitled"),
                description=property_data.get("description", ""),
                property_type=self._parse_property_type(property_data.get("type")),
                price=float(property_data.get("price", 0)),
                currency=property_data.get("currency", "AED"),
                address=property_data.get("address", ""),
                city=property_data.get("city", ""),
                emirate=property_data.get("emirate", ""),
                country=property_data.get("country", "UAE"),
                bedrooms=property_data.get("bedrooms"),
                bathrooms=property_data.get("bathrooms"),
                area_sqft=property_data.get("area_sqft"),
                year_built=property_data.get("year_built"),
                furnishing=property_data.get("furnishing"),
                images=property_data.get("images", []),
                video_url=property_data.get("video_url"),
                floor_plans=property_data.get("floor_plans", []),
                developer_name=property_data.get("developer_name"),
                project_name=property_data.get("project_name"),
                latitude=property_data.get("latitude"),
                longitude=property_data.get("longitude"),
                source_id=source_id,
                source_platform=source_platform,
                is_active=True,
                is_featured=False,
            )

            self.db.add(property_obj)
            self.db.flush()  # Flush to get the ID without committing
            logger.info(f"✅ Created property {source_id}: {property_obj.title}")

            return property_obj, True

        except Exception as e:
            logger.error(f"❌ Error creating property {source_id}: {e}")
            raise PropertySyncException(f"Failed to create property: {str(e)}")

    def update_property(
        self,
        property_obj: Property,
        property_data: Dict,
    ) -> bool:
        """
        Update existing property with new data.
        Only updates if data has actually changed.

        Args:
            property_obj: Existing Property object
            property_data: New property data

        Returns:
            True if property was updated, False if no changes
        """
        changes = False

        # Check and update fields
        fields_to_check = [
            ("title", "title"),
            ("description", "description"),
            ("price", "price"),
            ("bedrooms", "bedrooms"),
            ("bathrooms", "bathrooms"),
            ("area_sqft", "area_sqft"),
            ("year_built", "year_built"),
            ("furnishing", "furnishing"),
            ("images", "images"),
            ("video_url", "video_url"),
            ("floor_plans", "floor_plans"),
            ("developer_name", "developer_name"),
            ("project_name", "project_name"),
            ("latitude", "latitude"),
            ("longitude", "longitude"),
        ]

        for source_field, model_field in fields_to_check:
            new_value = property_data.get(source_field)
            old_value = getattr(property_obj, model_field, None)

            if new_value is not None and old_value != new_value:
                setattr(property_obj, model_field, new_value)
                changes = True

        if changes:
            property_obj.updated_at = datetime.now(UTC)
            logger.info(f"📝 Updated property {property_obj.source_id}")

        return changes

    def sync_properties(
        self,
        properties_data: List[Dict],
        sync_type: str = "incremental",
    ) -> Dict[str, int]:
        """
        Sync multiple properties with deduplication.

        Args:
            properties_data: List of property dictionaries from source
            sync_type: Type of sync (full, incremental, manual)

        Returns:
            Dictionary with sync statistics
        """
        stats = {
            "total_processed": 0,
            "created_count": 0,
            "updated_count": 0,
            "skipped_count": 0,
            "error_count": 0,
        }

        try:
            for prop_data in properties_data:
                stats["total_processed"] += 1

                try:
                    source_id = prop_data.get("id")
                    if not source_id:
                        logger.warning("Property missing source ID, skipping")
                        stats["skipped_count"] += 1
                        continue

                    # Get or create property
                    property_obj, is_new = self.get_or_create_property(
                        prop_data,
                        source_id=source_id,
                        source_platform="reelly",
                    )

                    if is_new:
                        stats["created_count"] += 1
                    else:
                        # Update if changed
                        if self.update_property(property_obj, prop_data):
                            stats["updated_count"] += 1
                        else:
                            stats["skipped_count"] += 1

                except PropertySyncException:
                    stats["error_count"] += 1
                except Exception as e:
                    logger.error(f"Unexpected error syncing property: {e}")
                    stats["error_count"] += 1

            # Commit all changes
            self.db.commit()
            logger.info(f"✅ Sync complete: {stats}")

            return stats

        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Sync failed: {e}")
            raise PropertySyncException(f"Sync operation failed: {str(e)}")

    def log_sync(
        self,
        sync_type: str,
        status: str,
        stats: Dict[str, int],
        error_details: Optional[str] = None,
    ) -> PropertySyncLog:
        """
        Log sync operation to database for audit trail.

        Args:
            sync_type: Type of sync (full, incremental, manual)
            status: Final status (pending, in_progress, completed, failed)
            stats: Sync statistics
            error_details: Error message if sync failed

        Returns:
            Created PropertySyncLog object
        """
        sync_log = PropertySyncLog(
            sync_type=sync_type,
            status=status,
            started_at=datetime.now(UTC),
            completed_at=datetime.now(UTC) if status != "in_progress" else None,
            total_processed=stats.get("total_processed", 0),
            created_count=stats.get("created_count", 0),
            updated_count=stats.get("updated_count", 0),
            deleted_count=stats.get("deleted_count", 0),
            error_details=error_details,
        )

        self.db.add(sync_log)
        self.db.commit()

        logger.info(f"📋 Logged sync operation: {sync_log.id}")
        return sync_log

    def get_sync_status(self) -> Dict[str, any]:
        """
        Get status of recent sync operations.

        Returns:
            Dictionary with recent sync stats
        """
        try:
            # Get last 5 syncs
            recent_syncs = self.db.query(PropertySyncLog).order_by(
                PropertySyncLog.created_at.desc()
            ).limit(5).all()

            total_properties = self.db.query(Property).count()
            synced_properties = self.db.query(Property).filter(
                Property.source_id.isnot(None)
            ).count()

            return {
                "total_properties": total_properties,
                "synced_from_reelly": synced_properties,
                "recent_syncs": [
                    {
                        "sync_type": s.sync_type,
                        "status": s.status,
                        "created": s.created_count,
                        "updated": s.updated_count,
                        "completed_at": s.completed_at.isoformat() if s.completed_at else None,
                    }
                    for s in recent_syncs
                ],
            }

        except Exception as e:
            logger.error(f"Error fetching sync status: {e}")
            return {
                "error": str(e),
                "total_properties": 0,
                "synced_from_reelly": 0,
                "recent_syncs": [],
            }

    def _parse_property_type(self, type_str: str) -> PropertyType:
        """
        Parse string property type to PropertyType enum.

        Args:
            type_str: Property type string from source

        Returns:
            PropertyType enum value
        """
        type_mapping = {
            "apartment": PropertyType.APARTMENT,
            "apt": PropertyType.APARTMENT,
            "flat": PropertyType.APARTMENT,
            "villa": PropertyType.VILLA,
            "townhouse": PropertyType.TOWNHOUSE,
            "town_house": PropertyType.TOWNHOUSE,
            "land": PropertyType.LAND,
            "commercial": PropertyType.COMMERCIAL,
            "office": PropertyType.OFFICE,
        }

        type_str_lower = (type_str or "apartment").lower().strip()
        return type_mapping.get(type_str_lower, PropertyType.APARTMENT)

    def handle_deleted_properties(
        self,
        deleted_source_ids: List[str],
    ) -> int:
        """
        Mark properties as inactive if deleted from source.

        Args:
            deleted_source_ids: List of source IDs that were deleted

        Returns:
            Count of properties marked as deleted
        """
        try:
            count = 0
            for source_id in deleted_source_ids:
                prop = self.db.query(Property).filter(
                    Property.source_id == source_id,
                    Property.source_platform == "reelly",
                ).first()

                if prop:
                    prop.is_active = False
                    prop.updated_at = datetime.now(UTC)
                    count += 1

            self.db.commit()
            logger.info(f"📝 Marked {count} properties as deleted")
            return count

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error handling deleted properties: {e}")
            return 0
