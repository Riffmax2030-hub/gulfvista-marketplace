#!/usr/bin/env python
"""
Add sample properties from Dubai, Abu Dhabi, Qatar, Kuwait, and Bahrain.
These are realistic property listings for expansion.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property, PropertyType
from datetime import datetime, UTC

load_dotenv()

# Properties data for multiple countries
PROPERTIES_DATA = [
    # DUBAI - 10 properties
    {
        "title": "Luxury Villa in Palm Jumeirah Dubai",
        "description": "Stunning 5-bedroom villa on the Palm with private beach access, infinity pool, and modern architecture.",
        "price": 8500000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 5,
        "bathrooms": 4,
        "property_type": PropertyType.VILLA,
        "address": "Palm Jumeirah, Dubai, UAE"
    },
    {
        "title": "Modern Apartment Downtown Dubai",
        "description": "2-bedroom apartment in heart of downtown with burj khalifa view, gym, and swimming pool.",
        "price": 2100000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Downtown Dubai, UAE"
    },
    {
        "title": "Marina Penthouse with Sea View",
        "description": "Luxurious 3-bedroom penthouse in Dubai Marina with stunning sea views and premium amenities.",
        "price": 4200000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 3,
        "bathrooms": 3,
        "property_type": PropertyType.APARTMENT,
        "address": "Dubai Marina, UAE"
    },
    {
        "title": "Townhouse in Arabian Ranches",
        "description": "Spacious 4-bedroom townhouse with garden and gated community amenities.",
        "price": 3800000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.TOWNHOUSE,
        "address": "Arabian Ranches, Dubai"
    },
    {
        "title": "Studio in JBR Beach Residential",
        "description": "Studio apartment with beach access and modern facilities in JBR community.",
        "price": 850000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 0,
        "bathrooms": 1,
        "property_type": PropertyType.APARTMENT,
        "address": "JBR, Dubai"
    },
    {
        "title": "Waterfront Villa Emaar Beachfront",
        "description": "Exclusive 6-bedroom villa with private beach and resort-style amenities.",
        "price": 12000000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 6,
        "bathrooms": 5,
        "property_type": PropertyType.VILLA,
        "address": "Emaar Beachfront, Dubai"
    },
    {
        "title": "Deira Gold Souk Residence",
        "description": "Traditional-style 3-bedroom apartment near Gold Souk with old Dubai charm.",
        "price": 1500000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Deira, Dubai"
    },
    {
        "title": "Business Bay Office Apartment",
        "description": "2-bedroom apartment suitable for short-term or long-term with business facilities.",
        "price": 1800000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Business Bay, Dubai"
    },
    {
        "title": "Jumeirah Golf Estate Mansion",
        "description": "Elegant 5-bedroom golf course property with private golf course views.",
        "price": 9500000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 5,
        "bathrooms": 4,
        "property_type": PropertyType.VILLA,
        "address": "Jumeirah Golf Estate, Dubai"
    },
    {
        "title": "Dubai Hills Estate Contemporary Villa",
        "description": "Modern 4-bedroom villa in prestigious Dubai Hills Estate community.",
        "price": 6500000,
        "city": "Dubai",
        "country": "UAE",
        "emirate": "Dubai",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.VILLA,
        "address": "Dubai Hills Estate, UAE"
    },

    # ABU DHABI - 8 properties
    {
        "title": "Saadiyat Island Beach Residence",
        "description": "Ultra-modern 3-bedroom apartment on famous Saadiyat Island with beach access.",
        "price": 3200000,
        "city": "Abu Dhabi",
        "country": "UAE",
        "emirate": "Abu Dhabi",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Saadiyat Island, Abu Dhabi"
    },
    {
        "title": "Emirates Palace Vicinity Luxury Villa",
        "description": "Prestigious 5-bedroom villa near Emirates Palace with sea views.",
        "price": 7800000,
        "city": "Abu Dhabi",
        "country": "UAE",
        "emirate": "Abu Dhabi",
        "bedrooms": 5,
        "bathrooms": 4,
        "property_type": PropertyType.VILLA,
        "address": "Corniche, Abu Dhabi"
    },
    {
        "title": "Al Reem Island High-Rise Apartment",
        "description": "Contemporary 2-bedroom apartment in booming Al Reem Island development.",
        "price": 2400000,
        "city": "Abu Dhabi",
        "country": "UAE",
        "emirate": "Abu Dhabi",
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Al Reem Island, Abu Dhabi"
    },
    {
        "title": "Yas Island Golf View Villa",
        "description": "4-bedroom villa with golf course views on Yas Island.",
        "price": 5500000,
        "city": "Abu Dhabi",
        "country": "UAE",
        "emirate": "Abu Dhabi",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.VILLA,
        "address": "Yas Island, Abu Dhabi"
    },
    {
        "title": "Khalifa City Townhouse",
        "description": "Spacious 3-bedroom townhouse in family-friendly Khalifa City.",
        "price": 1900000,
        "city": "Abu Dhabi",
        "country": "UAE",
        "emirate": "Abu Dhabi",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.TOWNHOUSE,
        "address": "Khalifa City, Abu Dhabi"
    },
    {
        "title": "Downtown Abu Dhabi Penthouse",
        "description": "Stunning penthouse in heart of downtown with city skyline views.",
        "price": 4500000,
        "city": "Abu Dhabi",
        "country": "UAE",
        "emirate": "Abu Dhabi",
        "bedrooms": 3,
        "bathrooms": 3,
        "property_type": PropertyType.APARTMENT,
        "address": "Downtown Abu Dhabi, UAE"
    },
    {
        "title": "Al Manara Beachfront Apartment",
        "description": "2-bedroom apartment with direct beach access and water sports facilities.",
        "price": 2800000,
        "city": "Abu Dhabi",
        "country": "UAE",
        "emirate": "Abu Dhabi",
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Al Manara, Abu Dhabi"
    },
    {
        "title": "Masdar City Eco-Friendly Home",
        "description": "Sustainable 4-bedroom eco-home in Masdar City development.",
        "price": 4200000,
        "city": "Abu Dhabi",
        "country": "UAE",
        "emirate": "Abu Dhabi",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.VILLA,
        "address": "Masdar City, Abu Dhabi"
    },

    # QATAR - 6 properties
    {
        "title": "Doha Lusail Marina Apartment",
        "description": "Modern 3-bedroom apartment overlooking Lusail Marina with premium facilities.",
        "price": 2800000,
        "city": "Doha",
        "country": "Qatar",
        "emirate": "Doha",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Lusail Marina, Doha, Qatar"
    },
    {
        "title": "West Bay Luxury Villa",
        "description": "Exclusive 5-bedroom villa in prestigious West Bay with pearl views.",
        "price": 7200000,
        "city": "Doha",
        "country": "Qatar",
        "emirate": "Doha",
        "bedrooms": 5,
        "bathrooms": 4,
        "property_type": PropertyType.VILLA,
        "address": "West Bay, Doha, Qatar"
    },
    {
        "title": "Downtown Doha Office Apartment",
        "description": "2-bedroom apartment in central Doha near business district.",
        "price": 2000000,
        "city": "Doha",
        "country": "Qatar",
        "emirate": "Doha",
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Downtown Doha, Qatar"
    },
    {
        "title": "Al Waab Suburban Villa",
        "description": "Spacious 4-bedroom villa in quiet Al Waab residential area.",
        "price": 4500000,
        "city": "Doha",
        "country": "Qatar",
        "emirate": "Doha",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.VILLA,
        "address": "Al Waab, Doha, Qatar"
    },
    {
        "title": "Corniche Waterfront Penthouse",
        "description": "Luxury penthouse with sea views on famous Doha Corniche.",
        "price": 4800000,
        "city": "Doha",
        "country": "Qatar",
        "emirate": "Doha",
        "bedrooms": 3,
        "bathrooms": 3,
        "property_type": PropertyType.APARTMENT,
        "address": "Corniche, Doha, Qatar"
    },
    {
        "title": "Education City Studio",
        "description": "Modern studio apartment near Education City with university amenities.",
        "price": 950000,
        "city": "Doha",
        "country": "Qatar",
        "emirate": "Doha",
        "bedrooms": 0,
        "bathrooms": 1,
        "property_type": PropertyType.APARTMENT,
        "address": "Education City, Doha, Qatar"
    },

    # KUWAIT - 5 properties
    {
        "title": "Salmiya Beach Resort Apartment",
        "description": "Upscale 3-bedroom apartment in popular Salmiya beach area.",
        "price": 2600000,
        "city": "Kuwait City",
        "country": "Kuwait",
        "emirate": "Kuwait",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Salmiya, Kuwait City, Kuwait"
    },
    {
        "title": "Bayan Executive Villa",
        "description": "Premium 5-bedroom villa in exclusive Bayan neighborhood.",
        "price": 6800000,
        "city": "Kuwait City",
        "country": "Kuwait",
        "emirate": "Kuwait",
        "bedrooms": 5,
        "bathrooms": 4,
        "property_type": PropertyType.VILLA,
        "address": "Bayan, Kuwait City, Kuwait"
    },
    {
        "title": "Mansouriya Modern Townhouse",
        "description": "Contemporary 3-bedroom townhouse in family community.",
        "price": 2200000,
        "city": "Kuwait City",
        "country": "Kuwait",
        "emirate": "Kuwait",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.TOWNHOUSE,
        "address": "Mansouriya, Kuwait City"
    },
    {
        "title": "Jabriya Residential Apartment",
        "description": "2-bedroom apartment in well-established Jabriya district.",
        "price": 1900000,
        "city": "Kuwait City",
        "country": "Kuwait",
        "emirate": "Kuwait",
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Jabriya, Kuwait City, Kuwait"
    },
    {
        "title": "Fahaheel Commercial-Residential Apt",
        "description": "2-bedroom mixed-use apartment suitable for business and residence.",
        "price": 1750000,
        "city": "Fahaheel",
        "country": "Kuwait",
        "emirate": "Kuwait",
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Fahaheel, Kuwait"
    },

    # BAHRAIN - 4 properties
    {
        "title": "Manama Downtown Luxury Apartment",
        "description": "3-bedroom apartment in heart of Manama business district.",
        "price": 2400000,
        "city": "Manama",
        "country": "Bahrain",
        "emirate": "Manama",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Manama, Bahrain"
    },
    {
        "title": "Budaiya Waterfront Villa",
        "description": "Spacious 4-bedroom villa with waterfront views in Budaiya.",
        "price": 4200000,
        "city": "Budaiya",
        "country": "Bahrain",
        "emirate": "Budaiya",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.VILLA,
        "address": "Budaiya, Bahrain"
    },
    {
        "title": "Amwaj Islands Penthouse",
        "description": "Luxurious penthouse in premier Amwaj Islands development.",
        "price": 3800000,
        "city": "Muharraq",
        "country": "Bahrain",
        "emirate": "Muharraq",
        "bedrooms": 3,
        "bathrooms": 3,
        "property_type": PropertyType.APARTMENT,
        "address": "Amwaj Islands, Bahrain"
    },
    {
        "title": "Riffa Residential Townhouse",
        "description": "Modern 3-bedroom townhouse in family-friendly Riffa.",
        "price": 1950000,
        "city": "Riffa",
        "country": "Bahrain",
        "emirate": "Riffa",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.TOWNHOUSE,
        "address": "Riffa, Bahrain"
    },
]

def add_properties():
    """Add multi-country properties to database."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("🌍 ADDING MULTI-COUNTRY PROPERTIES")
        print("="*80 + "\n")

        existing_count = db.query(Property).count()
        print(f"📋 Current properties in database: {existing_count}\n")

        added_count = 0

        for prop_data in PROPERTIES_DATA:
            try:
                # Create new property
                property_obj = Property(
                    title=prop_data["title"],
                    description=prop_data["description"],
                    price=prop_data["price"],
                    city=prop_data["city"],
                    country=prop_data["country"],
                    emirate=prop_data["emirate"],
                    bedrooms=prop_data["bedrooms"],
                    bathrooms=prop_data["bathrooms"],
                    property_type=prop_data["property_type"],
                    address=prop_data["address"],
                    images=[],  # Empty images array
                    floor_plans=[],  # Empty floor plans array
                    created_at=datetime.now(UTC),
                    updated_at=datetime.now(UTC),
                )
                db.add(property_obj)
                added_count += 1

                print(f"✅ {prop_data['title']}")
                print(f"   Location: {prop_data['city']}, {prop_data['country']}")
                print(f"   Price: ${prop_data['price']:,}")
                print(f"   Beds: {prop_data['bedrooms']} | Baths: {prop_data['bathrooms']}\n")

            except Exception as e:
                print(f"❌ Error adding {prop_data['title']}: {str(e)}\n")
                continue

        if added_count > 0:
            db.commit()
            print(f"\n💾 Saved {added_count} properties to database")

        print(f"\n✅ Multi-Country Addition Complete!")
        print(f"   Properties added: {added_count}")
        print(f"   Total properties now: {db.query(Property).count()}")
        print(f"\n📊 Breakdown by Country:")
        print(f"   • Dubai (UAE): 10")
        print(f"   • Abu Dhabi (UAE): 8")
        print(f"   • Qatar: 6")
        print(f"   • Kuwait: 5")
        print(f"   • Bahrain: 4")
        print(f"   • Total new: 33 properties")

        return True

    except Exception as e:
        print(f"\n❌ Error during addition: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = add_properties()
    exit(0 if success else 1)
