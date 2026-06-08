#!/usr/bin/env python
"""
Automatically assign realistic bedroom/bathroom numbers based on property type.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property
from datetime import datetime, UTC

load_dotenv()

def get_property_type(title):
    """Determine property type from title."""
    title_lower = title.lower()

    if 'villa' in title_lower:
        return 'villa'
    elif 'penthouse' in title_lower or 'pent house' in title_lower:
        return 'penthouse'
    elif 'townhouse' in title_lower or 'town house' in title_lower:
        return 'townhouse'
    elif 'studio' in title_lower:
        return 'studio'
    elif 'apartment' in title_lower or 'apt' in title_lower or 'residence' in title_lower:
        return 'apartment'
    elif 'house' in title_lower:
        return 'house'
    else:
        return 'apartment'  # default

def assign_beds_baths(property_type):
    """Assign realistic bedroom/bathroom counts based on property type."""
    import random

    # Mix values for more variety
    assignments = {
        'villa': (4, 3),           # 4 beds, 3 baths
        'penthouse': (3, 2),       # 3 beds, 2 baths
        'townhouse': (3, 2),       # 3 beds, 2 baths
        'studio': (0, 1),          # Studio (0 beds), 1 bath
        'house': (4, 3),           # 4 beds, 3 baths
        'apartment': random.choice([(3, 2), (4, 3)]),  # Mix 3-2 and 4-3
    }
    return assignments.get(property_type, random.choice([(3, 2), (4, 3)]))

def assign_all_properties():
    """Assign bedroom/bathroom numbers to all properties that are missing them."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("🛏️  AUTO-ASSIGNING BEDROOM & BATHROOM NUMBERS")
        print("="*80 + "\n")

        # Get all properties with missing data
        properties = db.query(Property).all()

        if not properties:
            print("⚠️  No properties found in database")
            return False

        print(f"📋 Found {len(properties)} properties\n")

        updated_count = 0

        for prop in properties:
            # Skip if already has bedroom/bathroom data
            if prop.bedrooms is not None and prop.bathrooms is not None:
                continue

            # Determine property type and assign numbers
            prop_type = get_property_type(prop.title)
            beds, baths = assign_beds_baths(prop_type)

            # Update the property
            prop.bedrooms = beds
            prop.bathrooms = baths
            updated_count += 1

            print(f"✅ {prop.title}")
            print(f"   Type: {prop_type.capitalize()}")
            print(f"   Assigned: {beds} Beds | {baths} Baths\n")

        if updated_count > 0:
            db.commit()
            print(f"\n💾 Saved {updated_count} properties to database")

        print(f"\n✅ Assignment Complete!")
        print(f"   Properties updated: {updated_count}/{len(properties)}")

        return True

    except Exception as e:
        print(f"\n❌ Error during assignment: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = assign_all_properties()
    exit(0 if success else 1)
