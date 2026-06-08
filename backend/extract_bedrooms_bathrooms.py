#!/usr/bin/env python
"""
Extract bedroom and bathroom info from property titles and descriptions.
Updates all properties with missing bedroom/bathroom data.
"""

import re
from dotenv import load_dotenv
from database import SessionLocal
from models import Property

load_dotenv()

def extract_bedrooms_from_title(title):
    """Extract bedroom count from property title. E.g., '2BR' -> 2"""
    if not title:
        return None

    # Look for patterns like "2BR", "2 BR", "2-BR"
    match = re.search(r'(\d+)\s*BR', title, re.IGNORECASE)
    if match:
        return int(match.group(1))

    return None

def extract_bathrooms_from_title(title):
    """Extract bathroom count from property title. E.g., '3BA' -> 3"""
    if not title:
        return None

    # Look for patterns like "3BA", "3 BA", "3-BA"
    # Also try "3 BH" or "3 Bathrooms"
    match = re.search(r'(\d+)\s*(?:BA|BH)', title, re.IGNORECASE)
    if match:
        return int(match.group(1))

    return None

def extract_from_description(description):
    """Try to extract bedroom/bathroom info from description"""
    if not description:
        return None, None

    bedrooms = None
    bathrooms = None

    # Look for patterns like "2 bedrooms" or "3 bathrooms"
    br_match = re.search(r'(\d+)\s+bedrooms?', description, re.IGNORECASE)
    if br_match:
        bedrooms = int(br_match.group(1))

    ba_match = re.search(r'(\d+)\s+bathrooms?', description, re.IGNORECASE)
    if ba_match:
        bathrooms = int(ba_match.group(1))

    return bedrooms, bathrooms

def update_all_properties():
    """Extract and update bedroom/bathroom info for all properties."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("🛏️  EXTRACTING BEDROOM & BATHROOM INFORMATION")
        print("="*80 + "\n")

        # Get all properties
        properties = db.query(Property).all()

        if not properties:
            print("⚠️  No properties found in database")
            return False

        print(f"📋 Found {len(properties)} properties\n")

        updated_count = 0
        success_count = 0

        for prop in properties:
            original_br = prop.bedrooms
            original_ba = prop.bathrooms

            # Try to extract from title first
            br_from_title = extract_bedrooms_from_title(prop.title)
            ba_from_title = extract_bathrooms_from_title(prop.title)

            # If not found in title, try description
            if not br_from_title or not ba_from_title:
                br_from_desc, ba_from_desc = extract_from_description(prop.description)
                br_from_title = br_from_title or br_from_desc
                ba_from_title = ba_from_title or ba_from_desc

            # Update if we found values and they're missing
            if br_from_title and (prop.bedrooms is None or prop.bedrooms == 0):
                prop.bedrooms = br_from_title
                success_count += 1

            if ba_from_title and (prop.bathrooms is None or prop.bathrooms == 0):
                prop.bathrooms = ba_from_title
                success_count += 1

            # Track updates
            if (br_from_title and original_br != br_from_title) or (ba_from_title and original_ba != ba_from_title):
                updated_count += 1
                print(f"✅ {prop.title}")
                if br_from_title:
                    print(f"   Bedrooms: {original_br} → {prop.bedrooms}")
                if ba_from_title:
                    print(f"   Bathrooms: {original_ba} → {prop.bathrooms}")

        # Commit changes
        if updated_count > 0:
            db.commit()
            print(f"\n💾 Saved {updated_count} properties to database")

        print(f"\n✅ Extraction Complete!")
        print(f"   Properties updated: {updated_count}/{len(properties)}")
        print(f"   Data points added: {success_count}")

        return True

    except Exception as e:
        print(f"\n❌ Error during extraction: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()


if __name__ == "__main__":
    success = update_all_properties()
    exit(0 if success else 1)
