#!/usr/bin/env python
"""
Generate 900+ realistic properties across UAE, Qatar, Kuwait, Bahrain, Oman, and Saudi Arabia.
Creates realistic property listings with varied names, prices, and characteristics.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property, PropertyType
from datetime import datetime, UTC
import random

load_dotenv()

# Real neighborhood names and their characteristics
LOCATIONS = {
    "UAE": {
        "Dubai": {
            "neighborhoods": [
                "Marina", "Downtown", "JBR", "Palm Jumeirah", "Arabian Ranches",
                "Dubai Hills", "Dubai Land", "Jumeirah", "Business Bay", "Creek Harbor",
                "Town Square", "Bluewaters", "Deira", "Bur Dubai", "Sheikh Zayed Road",
                "Barsha", "Tecom", "Dubai South", "Dubai Sports City", "Mirdif"
            ],
            "emirate": "Dubai"
        },
        "Abu Dhabi": {
            "neighborhoods": [
                "Saadiyat Island", "Al Reem Island", "Downtown Abu Dhabi", "Yas Island",
                "Al Manara", "Corniche", "Khalifa City", "Bawabat Al Sharq", "Al Reef",
                "Shakhbout City", "Al Bahar", "Masdar City", "Al Mina", "Al Marjan"
            ],
            "emirate": "Abu Dhabi"
        },
        "Sharjah": {
            "neighborhoods": [
                "Al Majaz", "Al Nahda", "Muelah", "Al Qasimia", "Al Reef",
                "Al Soor", "Al Qasbaa", "Al Wahda", "Al Manara", "Butina"
            ],
            "emirate": "Sharjah"
        },
        "Ajman": {
            "neighborhoods": [
                "Ajman City", "Al Noor", "Al Rawda", "Al Zahra", "Al Muhairi",
                "Al Mamourah", "Ajman Saray", "Corniche", "Al Baraka"
            ],
            "emirate": "Ajman"
        }
    },
    "Qatar": {
        "Doha": {
            "neighborhoods": [
                "Lusail", "West Bay", "Downtown", "Al Waab", "Al Dafna",
                "Pearl Qatar", "Bin Omran", "Umm Ghuwailina", "Al Mansoura", "Porto Arabia"
            ],
            "emirate": "Doha"
        }
    },
    "Kuwait": {
        "Kuwait City": {
            "neighborhoods": [
                "Salmiya", "Bayan", "Jabriya", "Mansouriya", "Fahaheel",
                "Khaitan", "Kaifan", "Farwaniya", "Zahra", "Mahboula"
            ],
            "emirate": "Kuwait"
        }
    },
    "Bahrain": {
        "Manama": {
            "neighborhoods": [
                "Manama Downtown", "Budaiya", "Riffa", "Amwaj Islands", "Al Baraka",
                "Muharraq", "Saar", "Zinj", "Juffair", "Adliya"
            ],
            "emirate": "Manama"
        }
    },
}

# Property characteristics by type
PROPERTY_CONFIGS = {
    PropertyType.APARTMENT: {
        "price_range": (800000, 5000000),
        "beds_range": (0, 4),
        "baths_range": (1, 3),
        "prefix": ["Modern", "Luxury", "Spacious", "Elegant", "Contemporary"],
        "suffix": ["Apartment", "Flat", "Residence"]
    },
    PropertyType.VILLA: {
        "price_range": (3000000, 15000000),
        "beds_range": (3, 7),
        "baths_range": (2, 5),
        "prefix": ["Luxury", "Stunning", "Spacious", "Modern", "Executive"],
        "suffix": ["Villa", "Home", "Residence"]
    },
    PropertyType.TOWNHOUSE: {
        "price_range": (1500000, 6000000),
        "beds_range": (2, 5),
        "baths_range": (2, 3),
        "prefix": ["Modern", "Spacious", "Family", "Contemporary"],
        "suffix": ["Townhouse", "Home"]
    },
    PropertyType.OFFICE: {
        "price_range": (500000, 3000000),
        "beds_range": (0, 2),
        "baths_range": (1, 2),
        "prefix": ["Professional", "Modern", "Prime", "Executive"],
        "suffix": ["Office", "Space", "Suite"]
    },
}

def generate_property_name(property_type, neighborhood):
    """Generate a realistic property name."""
    config = PROPERTY_CONFIGS.get(property_type)
    if not config:
        config = PROPERTY_CONFIGS[PropertyType.APARTMENT]

    prefix = random.choice(config["prefix"])
    suffix = random.choice(config["suffix"])

    return f"{prefix} {suffix} in {neighborhood}"

def generate_description(property_type, neighborhood):
    """Generate a property description."""
    descriptions = {
        PropertyType.APARTMENT: f"Beautiful apartment with modern amenities in {neighborhood}. Perfect for families and professionals.",
        PropertyType.VILLA: f"Stunning villa with spacious rooms and premium finishes in {neighborhood}. Ideal investment property.",
        PropertyType.TOWNHOUSE: f"Contemporary townhouse with excellent location in {neighborhood}. Great community amenities.",
        PropertyType.OFFICE: f"Professional office space in prime location at {neighborhood}. Modern facilities and flexible terms.",
    }
    return descriptions.get(property_type, f"Premium property in {neighborhood}")

def generate_bulk_properties():
    """Generate 900+ realistic properties."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("🏗️  GENERATING 900+ BULK PROPERTIES")
        print("="*80 + "\n")

        existing_count = db.query(Property).count()
        print(f"📋 Current properties in database: {existing_count}\n")
        print("⏳ Generating 900+ realistic properties...\n")

        added_count = 0
        property_list = []

        # Property types to generate
        types = [PropertyType.APARTMENT, PropertyType.VILLA, PropertyType.TOWNHOUSE, PropertyType.OFFICE]

        # Generate properties by location
        for country, cities in LOCATIONS.items():
            for city, city_data in cities.items():
                neighborhoods = city_data["neighborhoods"]
                emirate = city_data["emirate"]

                # Generate properties for each neighborhood
                for neighborhood in neighborhoods:
                    # 20-25 properties per neighborhood
                    for _ in range(random.randint(20, 25)):
                        property_type = random.choice(types)
                        config = PROPERTY_CONFIGS[property_type]

                        # Generate random values
                        price = random.randint(config["price_range"][0], config["price_range"][1])
                        bedrooms = random.randint(config["beds_range"][0], config["beds_range"][1])
                        bathrooms = random.randint(config["baths_range"][0], config["baths_range"][1])

                        name = generate_property_name(property_type, neighborhood)
                        description = generate_description(property_type, neighborhood)

                        property_obj = Property(
                            title=name,
                            description=description,
                            price=price,
                            currency="AED",
                            property_type=property_type,
                            city=city,
                            country=country,
                            emirate=emirate,
                            address=f"{neighborhood}, {city}, {country}",
                            bedrooms=bedrooms,
                            bathrooms=bathrooms,
                            images=[],
                            floor_plans=[],
                            created_at=datetime.now(UTC),
                            updated_at=datetime.now(UTC),
                        )

                        property_list.append(property_obj)
                        added_count += 1

        # Batch add to database
        print(f"💾 Adding {len(property_list)} properties to database...")
        db.bulk_save_objects(property_list)
        db.commit()

        total_count = db.query(Property).count()

        print(f"\n✅ Bulk Property Generation Complete!")
        print(f"   Properties generated: {added_count}")
        print(f"   Total properties now: {total_count}")
        print(f"\n📊 Property Breakdown:")

        for ptype in types:
            count = db.query(Property).filter(Property.property_type == ptype).count()
            print(f"   • {ptype.value.capitalize()}: {count}")

        print(f"\n🌍 Countries: {len(LOCATIONS)}")
        print(f"🏙️  Cities: {sum(len(cities) for cities in LOCATIONS.values())}")
        print(f"🏘️  Neighborhoods: {sum(len(city_data['neighborhoods']) for cities in LOCATIONS.values() for city_data in cities.values())}")

        return True

    except Exception as e:
        print(f"\n❌ Error during generation: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = generate_bulk_properties()
    exit(0 if success else 1)
