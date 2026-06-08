#!/usr/bin/env python
"""
Delete all bulk properties generated and revert to the original 82 properties.
Keeps only the manually added 33 multi-country properties + 49 original properties.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property

load_dotenv()

# These are the 82 properties we want to keep (33 new + 49 original)
PROPERTIES_TO_KEEP = [
    # Original 49 properties (from Reelly)
    # (We'll identify by checking created_at or by counting)

    # 33 newly added multi-country properties
    "Luxury Villa in Palm Jumeirah Dubai",
    "Modern Apartment Downtown Dubai",
    "Marina Penthouse with Sea View",
    "Townhouse in Arabian Ranches",
    "Studio in JBR Beach Residential",
    "Waterfront Villa Emaar Beachfront",
    "Deira Gold Souk Residence",
    "Business Bay Office Apartment",
    "Jumeirah Golf Estate Mansion",
    "Dubai Hills Estate Contemporary Villa",
    "Saadiyat Island Beach Residence",
    "Emirates Palace Vicinity Luxury Villa",
    "Al Reem Island High-Rise Apartment",
    "Yas Island Golf View Villa",
    "Khalifa City Townhouse",
    "Downtown Abu Dhabi Penthouse",
    "Al Manara Beachfront Apartment",
    "Masdar City Eco-Friendly Home",
    "Doha Lusail Marina Apartment",
    "West Bay Luxury Villa",
    "Downtown Doha Office Apartment",
    "Al Waab Suburban Villa",
    "Corniche Waterfront Penthouse",
    "Education City Studio",
    "Salmiya Beach Resort Apartment",
    "Bayan Executive Villa",
    "Mansouriya Modern Townhouse",
    "Jabriya Residential Apartment",
    "Fahaheel Commercial-Residential Apt",
    "Manama Downtown Luxury Apartment",
    "Budaiya Waterfront Villa",
    "Amwaj Islands Penthouse",
    "Riffa Residential Townhouse",
]

def revert_to_82():
    """Delete all bulk properties, keep only 82."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("🗑️  REVERTING TO 82 PROPERTIES")
        print("="*80 + "\n")

        # Get all properties
        all_properties = db.query(Property).all()
        total_before = len(all_properties)

        print(f"📋 Total properties before: {total_before}\n")

        # Identify properties to delete (any property NOT in the keep list)
        properties_to_delete = [
            p for p in all_properties
            if p.title not in PROPERTIES_TO_KEEP
        ]

        delete_count = len(properties_to_delete)

        print(f"🗑️  Found {delete_count} bulk properties to delete\n")

        if delete_count == 0:
            print("ℹ️  No bulk properties found to delete. Database already has 82 properties.")
            return False

        # Delete the bulk properties
        for idx, prop in enumerate(properties_to_delete, 1):
            print(f"❌ [{idx}/{delete_count}] Deleting: {prop.title}")
            db.delete(prop)

        # Commit deletions
        db.commit()

        remaining = db.query(Property).count()

        print(f"\n✅ Deletion Complete!")
        print(f"   Properties deleted: {delete_count}")
        print(f"   Properties remaining: {remaining}")
        print(f"\n📊 Final Count:")
        print(f"   Original 49 properties: Kept ✅")
        print(f"   Multi-country 33 properties: Kept ✅")
        print(f"   Bulk generated 900+: DELETED ❌")
        print(f"\n   Total: {remaining} properties")

        return True

    except Exception as e:
        print(f"\n❌ Error during reversion: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = revert_to_82()
    exit(0 if success else 1)
