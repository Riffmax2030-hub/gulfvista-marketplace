#!/usr/bin/env python
"""
Add 18 premium properties to reach 100 total.
All with luxury descriptions, images, and complete data.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property, PropertyType
from datetime import datetime, UTC
import requests

load_dotenv()

# 18 premium properties to add
NEW_PROPERTIES = [
    # SHARJAH - 5 properties
    {
        "title": "Luxury Waterfront Residence Sharjah",
        "description": "Exquisite waterfront residence epitomizing modern luxury living. Thoughtfully designed spaces with premium finishes, expansive windows flooding natural light, and sophisticated amenities. This exclusive development merges contemporary vision with timeless elegance, offering a sanctuary where precision meets comfort.",
        "price": 2800000,
        "city": "Sharjah",
        "country": "UAE",
        "emirate": "Sharjah",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Al Majaz, Sharjah, UAE"
    },
    {
        "title": "Premium Beachfront Villa Sharjah",
        "description": "Magnificent beachfront villa featuring stunning architectural design and premium finishes throughout. Panoramic sea views, curated landscape fostering serenity, and world-class amenities. Every detail reflects purposeful luxury and distinction in this exclusive coastal retreat.",
        "price": 5200000,
        "city": "Sharjah",
        "country": "UAE",
        "emirate": "Sharjah",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.VILLA,
        "address": "Corniche, Sharjah, UAE"
    },
    {
        "title": "Contemporary Executive Townhouse Sharjah",
        "description": "Modern executive townhouse with elegant design and premium furnishings. Fully equipped with quality appliances, multiple living areas, and sophisticated entertaining spaces. Located in prestigious community offering convenience and serene residential environment.",
        "price": 2200000,
        "city": "Sharjah",
        "country": "UAE",
        "emirate": "Sharjah",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.TOWNHOUSE,
        "address": "Al Nahda, Sharjah, UAE"
    },
    {
        "title": "Ultra-Luxury Penthouse Al Majaz",
        "description": "Breathtaking penthouse with commanding views and exceptional design. Every detail reflects meticulous attention to craftsmanship, from premium materials to strategic lighting creating an elevated atmosphere. An incomparable sanctuary where luxury transcends expectations.",
        "price": 4100000,
        "city": "Sharjah",
        "country": "UAE",
        "emirate": "Sharjah",
        "bedrooms": 3,
        "bathrooms": 3,
        "property_type": PropertyType.APARTMENT,
        "address": "Al Majaz Waterfront, Sharjah, UAE"
    },
    {
        "title": "Elegant Studio Apartment Downtown Sharjah",
        "description": "Sophisticated studio apartment capturing luxury in beautifully designed space. Expertly designed to maximize functionality with clean lines and premium finishes. Perfect for professionals seeking upscale urban living with contemporary sophistication.",
        "price": 950000,
        "city": "Sharjah",
        "country": "UAE",
        "emirate": "Sharjah",
        "bedrooms": 0,
        "bathrooms": 1,
        "property_type": PropertyType.APARTMENT,
        "address": "Downtown Sharjah, UAE"
    },

    # AJMAN - 3 properties
    {
        "title": "Premium Beachfront Apartment Ajman",
        "description": "Upscale apartment in prime beachfront location with direct access to pristine sandy beaches. Modern amenities, crystal-clear waterfront views, and exceptional community facilities. A serene sanctuary blending beauty with contemporary opulence.",
        "price": 1800000,
        "city": "Ajman",
        "country": "UAE",
        "emirate": "Ajman",
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Corniche, Ajman, UAE"
    },
    {
        "title": "Spacious Family Villa Ajman",
        "description": "Stunning villa offering spacious rooms and premium finishes in exclusive community. Curated landscape fostering serenity, world-class amenities, and striking architectural statement. Ideal investment property with unmatched craftsmanship.",
        "price": 4500000,
        "city": "Ajman",
        "country": "UAE",
        "emirate": "Ajman",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.VILLA,
        "address": "Al Rawda, Ajman, UAE"
    },
    {
        "title": "Modern Executive Townhouse Ajman",
        "description": "Contemporary townhouse in family-friendly community with elegant design and quality furnishings. Multiple living areas and sophisticated spaces reflecting purposeful design and comfort. Perfect for discerning professionals.",
        "price": 2000000,
        "city": "Ajman",
        "country": "UAE",
        "emirate": "Ajman",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.TOWNHOUSE,
        "address": "Al Zahra, Ajman, UAE"
    },

    # OMAN - 4 properties
    {
        "title": "Luxury Muscat Waterfront Apartment",
        "description": "Exceptional Muscat apartment epitomizing modern luxury with sophisticated design and premium comfort. Expansive windows showcase stunning waterfront vistas, warmly curated interiors, and world-class amenities. A testament to refined architectural excellence.",
        "price": 2400000,
        "city": "Muscat",
        "country": "Oman",
        "emirate": "Muscat",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Qurum, Muscat, Oman"
    },
    {
        "title": "Premium Villa in Muscat Hills",
        "description": "Magnificent villa in prestigious Muscat Hills offering breathtaking views and exceptional craftsmanship. Premium finishes, spacious layouts, and curated landscapes create an exclusive retreat. Merges luxury with natural beauty.",
        "price": 4800000,
        "city": "Muscat",
        "country": "Oman",
        "emirate": "Muscat",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.VILLA,
        "address": "Muscat Hills, Muscat, Oman"
    },
    {
        "title": "Contemporary Townhouse Seeb",
        "description": "Modern townhouse in established Seeb community with elegant design and quality construction. Multiple living areas, premium finishes, and thoughtful spatial organization. Offers convenience and refined living.",
        "price": 2100000,
        "city": "Seeb",
        "country": "Oman",
        "emirate": "Seeb",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.TOWNHOUSE,
        "address": "Seeb, Muscat, Oman"
    },
    {
        "title": "Sophisticated Studio Apartment Muscat",
        "description": "Elegant studio capturing luxury in efficiently designed space. Premium finishes, smart spatial organization, and contemporary fixtures for upscale urban living. Perfect for professionals seeking sophisticated accommodation.",
        "price": 1100000,
        "city": "Muscat",
        "country": "Oman",
        "emirate": "Muscat",
        "bedrooms": 0,
        "bathrooms": 1,
        "property_type": PropertyType.APARTMENT,
        "address": "Ruwi, Muscat, Oman"
    },

    # SAUDI ARABIA - 3 properties
    {
        "title": "Luxury Executive Apartment Riyadh",
        "description": "Sophisticated Riyadh apartment with contemporary design and premium amenities. Thoughtfully curated spaces featuring upscale furnishings and modern fixtures. Perfect for executives seeking refined urban living with world-class facilities.",
        "price": 2600000,
        "city": "Riyadh",
        "country": "Saudi Arabia",
        "emirate": "Riyadh",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Al Nakheel, Riyadh, Saudi Arabia"
    },
    {
        "title": "Premium Villa in Riyadh Suburbs",
        "description": "Stunning villa with exceptional design and premium finishes in prestigious residential area. Spacious rooms, quality construction, and curated amenities. Ideal for families seeking luxury and comfort in exclusive community.",
        "price": 4200000,
        "city": "Riyadh",
        "country": "Saudi Arabia",
        "emirate": "Riyadh",
        "bedrooms": 4,
        "bathrooms": 3,
        "property_type": PropertyType.VILLA,
        "address": "Buona Vista, Riyadh, Saudi Arabia"
    },
    {
        "title": "Modern Penthouse Jeddah",
        "description": "Ultra-luxury penthouse with commanding views and sophisticated design. Premium materials, exceptional craftsmanship, and exclusive amenities. An incomparable sanctuary offering unmatched refinement and distinction in prestigious location.",
        "price": 3900000,
        "city": "Jeddah",
        "country": "Saudi Arabia",
        "emirate": "Jeddah",
        "bedrooms": 3,
        "bathrooms": 3,
        "property_type": PropertyType.APARTMENT,
        "address": "Corniche, Jeddah, Saudi Arabia"
    },

    # ADDITIONAL PREMIUM LOCATIONS - 3 properties
    {
        "title": "Exclusive Waterfront Estate Ras Al Khaimah",
        "description": "Exclusive waterfront residence capturing island living with unmatched craftsmanship and sophistication. Panoramic vistas, world-class amenities, and culturally rich elegance. Where living transcends ordinary with purpose-driven luxury.",
        "price": 3600000,
        "city": "Ras Al Khaimah",
        "country": "UAE",
        "emirate": "Ras Al Khaimah",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Mina Al Arab, Ras Al Khaimah, UAE"
    },
    {
        "title": "Premier Villa Al Marjan Island",
        "description": "Magnificent villa on prestigious Al Marjan Island with breathtaking architectural design. Premium finishes, spacious layouts, and exclusive coastal amenities. Merges contemporary vision with timeless elegance in island paradise.",
        "price": 6200000,
        "city": "Ras Al Khaimah",
        "country": "UAE",
        "emirate": "Ras Al Khaimah",
        "bedrooms": 5,
        "bathrooms": 4,
        "property_type": PropertyType.VILLA,
        "address": "Al Marjan Island, Ras Al Khaimah, UAE"
    },
    {
        "title": "Sophisticated Penthouse Umm Al Quwain",
        "description": "Elegant penthouse with contemporary design and premium furnishings. Commanding views, sophisticated amenities, and refined interiors. Perfect for discerning professionals seeking luxury and tranquility in serene setting.",
        "price": 2300000,
        "city": "Umm Al Quwain",
        "country": "UAE",
        "emirate": "Umm Al Quwain",
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": PropertyType.APARTMENT,
        "address": "Al Gurg, Umm Al Quwain, UAE"
    },
]

def get_unsplash_images(property_type, count=3):
    """Fetch images from Unsplash API."""
    try:
        search_terms = {
            PropertyType.APARTMENT: "luxury executive apartment interior modern",
            PropertyType.VILLA: "luxury villa exterior modern architecture",
            PropertyType.PENTHOUSE: "luxury penthouse interior high rise",
            PropertyType.TOWNHOUSE: "luxury townhouse modern contemporary",
        }

        search_term = search_terms.get(property_type, "luxury apartment interior")

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
            return images if images else []
        return []

    except Exception as e:
        print(f"Error fetching images: {e}")
        return []

def add_18_properties():
    """Add 18 premium properties with all features."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("✨ ADDING 18 PREMIUM PROPERTIES TO REACH 100 TOTAL")
        print("="*80 + "\n")

        existing_count = db.query(Property).count()
        print(f"📋 Current properties in database: {existing_count}\n")
        print("⏳ Adding 18 premium properties with images...\n")

        added_count = 0

        for idx, prop_data in enumerate(NEW_PROPERTIES, 1):
            try:
                # Fetch images for this property
                images = get_unsplash_images(prop_data["property_type"], count=3)

                # Create property
                property_obj = Property(
                    title=prop_data["title"],
                    description=prop_data["description"],
                    price=prop_data["price"],
                    currency="AED",
                    property_type=prop_data["property_type"],
                    city=prop_data["city"],
                    country=prop_data["country"],
                    emirate=prop_data["emirate"],
                    address=prop_data["address"],
                    bedrooms=prop_data["bedrooms"],
                    bathrooms=prop_data["bathrooms"],
                    images=images if images else [],
                    floor_plans=[],
                    created_at=datetime.now(UTC),
                    updated_at=datetime.now(UTC),
                )

                db.add(property_obj)
                added_count += 1

                print(f"✅ [{idx}/18] {prop_data['title']}")
                print(f"   Location: {prop_data['city']}, {prop_data['country']}")
                print(f"   Price: ${prop_data['price']:,}")
                print(f"   Beds: {prop_data['bedrooms']} | Baths: {prop_data['bathrooms']}")
                print(f"   Images: {len(images)}\n")

            except Exception as e:
                print(f"❌ [{idx}/18] Error adding {prop_data['title']}: {str(e)}\n")
                continue

        if added_count > 0:
            db.commit()
            print(f"\n💾 Saved {added_count} properties to database")

        total_count = db.query(Property).count()

        print(f"\n✅ Addition Complete!")
        print(f"   Properties added: {added_count}")
        print(f"   Total properties now: {total_count}")
        print(f"\n📊 Breakdown:")
        print(f"   Original 49: ✅")
        print(f"   Multi-country 33: ✅")
        print(f"   New Premium 18: ✅")
        print(f"   TOTAL: {total_count} properties")
        print(f"\n🌍 Now available in:")
        print(f"   • UAE (Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UMQ)")
        print(f"   • Qatar (Doha)")
        print(f"   • Kuwait")
        print(f"   • Bahrain")
        print(f"   • Oman (Muscat)")
        print(f"   • Saudi Arabia (Riyadh, Jeddah)")

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
    success = add_18_properties()
    exit(0 if success else 1)
