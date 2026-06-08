#!/usr/bin/env python
"""
Verify all properties have images. Add missing images from Unsplash.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property
from datetime import datetime, UTC
import requests

load_dotenv()

def get_unsplash_images(property_type, count=3):
    """Fetch images from Unsplash API."""
    try:
        search_terms = {
            "apartment": "luxury executive apartment interior modern",
            "villa": "luxury villa exterior modern architecture",
            "penthouse": "luxury penthouse interior high rise",
            "townhouse": "luxury townhouse modern contemporary",
        }

        prop_type = property_type.value if hasattr(property_type, 'value') else str(property_type)
        search_term = search_terms.get(prop_type, "luxury apartment interior")

        url = "https://api.unsplash.com/search/photos"
        params = {
            "query": search_term,
            "per_page": count,
            "orientation": "landscape",
            "client_id": "guest"
        }

        response = requests.get(url, params=params, timeout=10)

        if response.status_code == 200:
            data = response.json()
            images = []
            for result in data.get("results", [])[:count]:
                images.append(result["urls"]["regular"])
            return images
        return []

    except Exception as e:
        print(f"Error fetching images: {e}")
        return []

def verify_and_add_images():
    """Verify all properties have images and add missing ones."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("🖼️  VERIFYING IMAGES FOR ALL PROPERTIES")
        print("="*80 + "\n")

        # Get all properties
        all_properties = db.query(Property).all()

        print(f"📋 Total properties: {len(all_properties)}\n")

        # Check which ones are missing images
        missing_images = [
            p for p in all_properties
            if not p.images or len(p.images) == 0
        ]

        with_images = len(all_properties) - len(missing_images)

        print(f"✅ Properties with images: {with_images}")
        print(f"❌ Properties missing images: {len(missing_images)}\n")

        if len(missing_images) == 0:
            print("🎉 All properties already have images! Nothing to do.")
            return True

        # Add images to properties that are missing them
        print(f"⏳ Adding images to {len(missing_images)} properties...\n")

        updated_count = 0

        for idx, prop in enumerate(missing_images, 1):
            try:
                # Fetch images
                images = get_unsplash_images(prop.property_type, count=3)

                if images:
                    prop.images = images
                    prop.updated_at = datetime.now(UTC)
                    updated_count += 1

                    print(f"✅ [{idx}/{len(missing_images)}] {prop.title}")
                    print(f"   Added {len(images)} images\n")
                else:
                    print(f"⚠️  [{idx}/{len(missing_images)}] {prop.title}")
                    print(f"   Failed to fetch images (using empty)\n")

            except Exception as e:
                print(f"❌ [{idx}/{len(missing_images)}] Error with {prop.title}: {str(e)}\n")
                continue

        if updated_count > 0:
            db.commit()
            print(f"\n💾 Saved {updated_count} properties with new images")

        # Final verification
        all_properties_updated = db.query(Property).all()
        final_missing = [p for p in all_properties_updated if not p.images or len(p.images) == 0]

        print(f"\n✅ Verification Complete!")
        print(f"   Images added: {updated_count}")
        print(f"   Total with images: {len(all_properties_updated) - len(final_missing)}")
        print(f"   Still missing: {len(final_missing)}")

        if len(final_missing) == 0:
            print(f"\n🎉 SUCCESS! All {len(all_properties_updated)} properties now have images!")
        else:
            print(f"\n⚠️  {len(final_missing)} properties still missing images:")
            for p in final_missing:
                print(f"   - {p.title}")

        return True

    except Exception as e:
        print(f"\n❌ Error during verification: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = verify_and_add_images()
    exit(0 if success else 1)
