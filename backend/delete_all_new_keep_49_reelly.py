#!/usr/bin/env python
"""
Delete ALL added properties. Keep ONLY the original 49 from Reelly API.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property

load_dotenv()

# All properties we ADDED (to be deleted)
PROPERTIES_TO_DELETE = [
    # 33 Multi-country properties
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

    # 18 Premium properties
    "Luxury Waterfront Residence Sharjah",
    "Premium Beachfront Villa Sharjah",
    "Contemporary Executive Townhouse Sharjah",
    "Ultra-Luxury Penthouse Al Majaz",
    "Elegant Studio Apartment Downtown Sharjah",
    "Premium Beachfront Apartment Ajman",
    "Spacious Family Villa Ajman",
    "Modern Executive Townhouse Ajman",
    "Luxury Muscat Waterfront Apartment",
    "Premium Villa in Muscat Hills",
    "Contemporary Townhouse Seeb",
    "Sophisticated Studio Apartment Muscat",
    "Luxury Executive Apartment Riyadh",
    "Premium Villa in Riyadh Suburbs",
    "Modern Penthouse Jeddah",
    "Exclusive Waterfront Estate Ras Al Khaimah",
    "Premier Villa Al Marjan Island",
    "Sophisticated Penthouse Umm Al Quwain",
]

def delete_new_properties():
    """Delete all added properties, keep only original 49."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("🗑️  DELETING ALL NEW PROPERTIES - KEEPING ONLY ORIGINAL 49 FROM REELLY")
        print("="*80 + "\n")

        # Get all properties
        all_properties = db.query(Property).all()
        total_before = len(all_properties)

        print(f"📋 Total properties before: {total_before}\n")

        # Find properties to delete
        properties_to_delete = [
            p for p in all_properties
            if p.title in PROPERTIES_TO_DELETE
        ]

        delete_count = len(properties_to_delete)

        print(f"🗑️  Found {delete_count} added properties to delete\n")

        # Delete them
        for idx, prop in enumerate(properties_to_delete, 1):
            print(f"❌ [{idx}/{delete_count}] Deleting: {prop.title}")
            db.delete(prop)

        # Commit
        db.commit()

        remaining = db.query(Property).count()

        print(f"\n✅ Deletion Complete!")
        print(f"   Properties deleted: {delete_count}")
        print(f"   Properties remaining: {remaining}")
        print(f"\n📊 Final Status:")
        print(f"   Original Reelly (49): ✅ KEPT")
        print(f"   Multi-country (33): ❌ DELETED")
        print(f"   Premium 18: ❌ DELETED")
        print(f"\n   Total: {remaining} properties (should be 49)")

        if remaining == 49:
            print(f"\n✅ PERFECT! Back to original 49 properties from Reelly API")
        else:
            print(f"\n⚠️  Note: You have {remaining} properties (expected 49)")

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
    success = delete_new_properties()
    exit(0 if success else 1)
