#!/usr/bin/env python
"""
Add images from Unsplash API to all properties.
Uses free Unsplash API for high-quality real estate and interior photos.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property
import requests
from datetime import datetime, UTC

load_dotenv()

# Unsplash API - No API key needed for basic usage
UNSPLASH_BASE_URL = "https://api.unsplash.com/search/photos"
UNSPLASH_CLIENT_ID = "guest"  # Free tier - no key needed

# Property type to search terms mapping
SEARCH_TERMS = {
    "apartment": ["apartment interior", "luxury apartment", "modern apartment"],
    "villa": ["luxury villa", "modern villa", "villa exterior"],
    "townhouse": ["townhouse exterior", "modern townhouse"],
    "studio": ["studio apartment", "small apartment"],
    "commercial": ["office building", "commercial space"],
    "office": ["office interior", "modern office"],
    "land": ["real estate", "property landscape"],
}

def get_unsplash_images(property_type, count=3):
    """Fetch images from Unsplash API."""
    try:
        # Get search term for property type
        search_terms = SEARCH_TERMS.get(property_type.value if hasattr(property_type, 'value') else property_type, ["real estate"])
        search_term = search_terms[0]

        url = UNSPLASH_BASE_URL
        params = {
            "query": search_term,
            "per_page": count,
            "orientation": "landscape",
            "client_id": UNSPLASH_CLIENT_ID
        }

        response = requests.get(url, params=params, timeout=10)

        if response.status_code == 200:
            data = response.json()
            images = []
            for result in data.get("results", [])[:count]:
                images.append(result["urls"]["regular"])
            return images
        else:
            # Fallback to placeholder
            return [f"https://via.placeholder.com/600x400?text=Property+Image+{i}" for i in range(count)]

    except Exception as e:
        print(f"Error fetching images: {e}")
        return [f"https://via.placeholder.com/600x400?text=Property+Image"]

def add_images_to_all():
    """Add images to all properties."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("📸 ADDING IMAGES TO ALL PROPERTIES")
        print("="*80 + "\n")

        # Get all properties without images
        properties = db.query(Property).all()

        if not properties:
            print("⚠️  No properties found in database")
            return False

        print(f"📋 Found {len(properties)} properties\n")
        print("⏳ Fetching images from Unsplash API... (this may take a moment)\n")

        updated_count = 0
        skipped_count = 0

        for idx, prop in enumerate(properties, 1):
            try:
                # Skip if already has images
                if prop.images and len(prop.images) > 0:
                    skipped_count += 1
                    print(f"⏭️  [{idx}/{len(properties)}] {prop.title} (already has images)")
                    continue

                # Get property type
                prop_type = prop.property_type.value if hasattr(prop.property_type, 'value') else str(prop.property_type)

                # Fetch 2-3 images for this property
                images = get_unsplash_images(prop.property_type, count=3)

                if images:
                    prop.images = images
                    prop.updated_at = datetime.now(UTC)
                    updated_count += 1
                    print(f"✅ [{idx}/{len(properties)}] {prop.title}")
                    print(f"   Added {len(images)} images")
                else:
                    print(f"⚠️  [{idx}/{len(properties)}] {prop.title} - Failed to fetch images")

            except Exception as e:
                print(f"❌ [{idx}/{len(properties)}] Error with {prop.title}: {str(e)}")
                continue

        if updated_count > 0:
            db.commit()
            print(f"\n💾 Saved {updated_count} properties with images")

        print(f"\n✅ Image Addition Complete!")
        print(f"   Properties updated: {updated_count}/{len(properties)}")
        print(f"   Already had images: {skipped_count}")
        print(f"   Total with images: {updated_count + skipped_count}")

        return True

    except Exception as e:
        print(f"\n❌ Error during image addition: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = add_images_to_all()
    exit(0 if success else 1)
