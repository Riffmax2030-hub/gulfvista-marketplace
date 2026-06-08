#!/usr/bin/env python
"""
Add high-quality placeholder images to properties missing images.
Uses free placeholder service that works without API keys.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property
from datetime import datetime, UTC

load_dotenv()

def get_placeholder_images(property_type, count=3):
    """Generate placeholder image URLs."""
    prop_type = property_type.value if hasattr(property_type, 'value') else str(property_type)

    # Use high-quality placeholder service
    placeholders = {
        "apartment": [
            f"https://images.unsplash.com/photo-1554995207-c18231b6ce48?w=600&h=400&fit=crop",
            f"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
            f"https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=600&h=400&fit=crop",
        ],
        "villa": [
            f"https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600&h=400&fit=crop",
            f"https://images.unsplash.com/photo-1572120471610-d971cc0b2188?w=600&h=400&fit=crop",
            f"https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
        ],
        "penthouse": [
            f"https://images.unsplash.com/photo-1512217867214-20abc2c5f1c4?w=600&h=400&fit=crop",
            f"https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=600&h=400&fit=crop",
            f"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
        ],
        "townhouse": [
            f"https://images.unsplash.com/photo-1570129477492-45929003d2de?w=600&h=400&fit=crop",
            f"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
            f"https://images.unsplash.com/photo-1570129477492-45929003d2de?w=600&h=400&fit=crop",
        ],
    }

    return placeholders.get(prop_type, placeholders["apartment"])[:count]

def add_placeholder_images():
    """Add placeholder images to all properties missing images."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("🖼️  ADDING PLACEHOLDER IMAGES TO MISSING PROPERTIES")
        print("="*80 + "\n")

        # Get all properties
        all_properties = db.query(Property).all()

        print(f"📋 Total properties: {len(all_properties)}\n")

        # Find properties missing images
        missing_images = [
            p for p in all_properties
            if not p.images or len(p.images) == 0
        ]

        with_images = len(all_properties) - len(missing_images)

        print(f"✅ Properties with images: {with_images}")
        print(f"❌ Properties missing images: {len(missing_images)}\n")

        if len(missing_images) == 0:
            print("🎉 All properties already have images!")
            return True

        print(f"⏳ Adding placeholder images to {len(missing_images)} properties...\n")

        updated_count = 0

        for idx, prop in enumerate(missing_images, 1):
            try:
                # Get placeholder images
                images = get_placeholder_images(prop.property_type, count=3)

                if images:
                    prop.images = images
                    prop.updated_at = datetime.now(UTC)
                    updated_count += 1

                    print(f"✅ [{idx}/{len(missing_images)}] {prop.title}")
                    print(f"   Added {len(images)} placeholder images\n")

            except Exception as e:
                print(f"❌ [{idx}/{len(missing_images)}] Error with {prop.title}: {str(e)}\n")
                continue

        if updated_count > 0:
            db.commit()
            print(f"\n💾 Saved {updated_count} properties with images")

        # Final verification
        all_properties_updated = db.query(Property).all()
        final_missing = [p for p in all_properties_updated if not p.images or len(p.images) == 0]

        print(f"\n✅ Placeholder Image Addition Complete!")
        print(f"   Images added: {updated_count}")
        print(f"   Total with images: {len(all_properties_updated) - len(final_missing)}/{len(all_properties_updated)}")

        if len(final_missing) == 0:
            print(f"\n🎉 SUCCESS! All {len(all_properties_updated)} properties now have images!")

        return True

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = add_placeholder_images()
    exit(0 if success else 1)
