"""
Reelly API synchronization module for gulfvista.properties.
Pulls property data from Reelly API and syncs to local database.
Runs on a scheduled basis via APScheduler or similar task scheduler.
"""

import httpx
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, UTC
from sqlalchemy.orm import Session
import config
from database import SessionLocal, init_db
from models import Property, PropertyType

logger = logging.getLogger(__name__)


class ReelylyApiClient:
    """Client for interacting with the Reelly API."""

    def __init__(self, api_key: str, base_url: str):
        """
        Initialize Reelly API client.

        Args:
            api_key: Reelly API authentication key
            base_url: Base URL for Reelly API
        """
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    async def fetch_projects(self) -> Optional[List[Dict[str, Any]]]:
        """
        Fetch all projects from Reelly API.

        Returns:
            List of project data or None if request fails
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/projects",
                    headers=self.headers,
                )
                response.raise_for_status()
                data = response.json()
                logger.info(f"Fetched {len(data.get('projects', []))} projects from Reelly")
                return data.get("projects", [])
        except httpx.RequestError as e:
            logger.error(f"Failed to fetch projects from Reelly: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching projects: {e}")
            return None

    async def fetch_properties(self, project_id: Optional[str] = None) -> Optional[List[Dict[str, Any]]]:
        """
        Fetch properties from Reelly API.

        Args:
            project_id: Optional project ID filter

        Returns:
            List of property data or None if request fails
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                params = {}
                if project_id:
                    params["project_id"] = project_id

                response = await client.get(
                    f"{self.base_url}/properties",
                    headers=self.headers,
                    params=params,
                )
                response.raise_for_status()
                data = response.json()
                logger.info(f"Fetched {len(data.get('properties', []))} properties from Reelly")
                return data.get("properties", [])
        except httpx.RequestError as e:
            logger.error(f"Failed to fetch properties from Reelly: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching properties: {e}")
            return None

    async def fetch_developers(self) -> Optional[List[Dict[str, Any]]]:
        """
        Fetch developer/company information from Reelly API.

        Returns:
            List of developer data or None if request fails
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/developers",
                    headers=self.headers,
                )
                response.raise_for_status()
                data = response.json()
                logger.info(f"Fetched {len(data.get('developers', []))} developers from Reelly")
                return data.get("developers", [])
        except httpx.RequestError as e:
            logger.error(f"Failed to fetch developers from Reelly: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching developers: {e}")
            return None


class PropertySyncService:
    """Service for synchronizing Reelly properties to local database."""

    def __init__(self, db: Session):
        """Initialize sync service."""
        self.db = db
        self.client = ReelylyApiClient(config.REELLY_API_KEY, config.REELLY_BASE_URL)

    @staticmethod
    def map_property_type(reelly_type: str) -> PropertyType:
        """
        Map Reelly property type to our PropertyType enum.

        Args:
            reelly_type: Type from Reelly API

        Returns:
            Mapped PropertyType
        """
        type_mapping = {
            "apartment": PropertyType.APARTMENT,
            "villa": PropertyType.VILLA,
            "townhouse": PropertyType.TOWNHOUSE,
            "land": PropertyType.LAND,
            "commercial": PropertyType.COMMERCIAL,
            "office": PropertyType.OFFICE,
        }
        return type_mapping.get(reelly_type.lower(), PropertyType.APARTMENT)

    def sync_property(self, property_data: Dict[str, Any]) -> Optional[Property]:
        """
        Sync a single property from Reelly to database.
        Creates or updates the property as needed.

        Args:
            property_data: Property data from Reelly API

        Returns:
            Property object or None if sync fails
        """
        try:
            source_id = property_data.get("id")

            # Check if property already exists
            existing = self.db.query(Property).filter(
                Property.source_id == source_id,
                Property.source_platform == "reelly",
            ).first()

            property_obj = existing or Property()

            # Extract location data (nested in Reelly response)
            location = property_data.get("location", {})

            # Map Reelly v2.0 data to our schema
            property_obj.title = property_data.get("name", "Untitled")
            property_obj.description = property_data.get("overview", "")
            property_obj.property_type = PropertyType.APARTMENT  # Reelly doesn't specify, default to apartment

            # Price: use min_price from Reelly
            min_price = property_data.get("min_price", 0)
            property_obj.price = float(min_price) if min_price else 0
            property_obj.currency = property_data.get("price_currency", "AED")

            # Size data
            min_size = property_data.get("min_size")
            property_obj.area_sqft = float(min_size) if min_size else None
            property_obj.price_per_sqft = None  # Calculate from price/size if needed

            # Location data from nested location object
            property_obj.address = f"{location.get('sector', '')} - {location.get('district', '')}"
            property_obj.city = location.get("city") or "Dubai"
            property_obj.emirate = location.get("region", "Dubai")
            property_obj.country = "UAE"
            property_obj.latitude = location.get("latitude")
            property_obj.longitude = location.get("longitude")

            # Property details (Reelly doesn't provide, so keep as None)
            property_obj.bedrooms = None
            property_obj.bathrooms = None
            property_obj.year_built = None
            property_obj.furnishing = "unfurnished"

            # Media: extract cover image URL
            cover_image = property_data.get("cover_image", {})
            images = []
            if cover_image.get("url"):
                images.append(cover_image.get("url"))
            property_obj.images = images
            property_obj.video_url = None
            property_obj.floor_plans = []

            # Developer info from Reelly
            property_obj.developer_name = property_data.get("developer")
            property_obj.project_name = property_data.get("name")
            property_obj.developer_logo_url = None

            # Source tracking
            property_obj.source_id = source_id
            property_obj.source_platform = "reelly"
            property_obj.is_active = property_data.get("is_published", True)

            if not existing:
                self.db.add(property_obj)
                logger.info(f"Created new property: {source_id} - {property_obj.title}")
            else:
                logger.info(f"Updated existing property: {source_id} - {property_obj.title}")

            return property_obj

        except Exception as e:
            logger.error(f"Error syncing property {property_data.get('id')}: {e}")
            import traceback
            traceback.print_exc()
            return None

    async def sync_all_properties(self) -> Dict[str, int]:
        """
        Fetch and sync all properties from Reelly API.

        Returns:
            Dictionary with sync statistics (created, updated, failed)
        """
        stats = {"created": 0, "updated": 0, "failed": 0}

        logger.info("Starting Reelly property sync...")

        try:
            # Fetch properties from Reelly
            properties = await self.client.fetch_properties()

            if not properties:
                logger.warning("No properties returned from Reelly API")
                return stats

            # Sync each property
            for prop_data in properties:
                source_id = prop_data.get("id")

                # Check if this property already exists BEFORE syncing
                was_existing = self.db.query(Property).filter(
                    Property.source_id == source_id,
                    Property.source_platform == "reelly"
                ).first() is not None

                synced = self.sync_property(prop_data)
                if synced:
                    if was_existing:
                        stats["updated"] += 1
                    else:
                        stats["created"] += 1
                else:
                    stats["failed"] += 1

            # Commit all changes
            self.db.commit()
            logger.info(
                f"Sync completed: {stats['created']} created, "
                f"{stats['updated']} updated, {stats['failed']} failed"
            )

            return stats

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error during property sync: {e}")
            return stats


async def run_sync() -> None:
    """
    Main function to run property sync.
    Call this from your scheduler or task runner.
    """
    init_db()
    db = SessionLocal()

    try:
        service = PropertySyncService(db)
        stats = await service.sync_all_properties()
        logger.info(f"Sync statistics: {stats}")
    finally:
        db.close()


if __name__ == "__main__":
    import asyncio

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    asyncio.run(run_sync())
