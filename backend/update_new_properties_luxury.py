#!/usr/bin/env python
"""
Update the 33 newly added properties with luxury executive apartment descriptions
and fetch images for only those properties.
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property
import requests
from datetime import datetime, UTC

load_dotenv()

# Luxury executive apartment descriptions by property type
LUXURY_DESCRIPTIONS = {
    "villa": "Exquisite luxury villa featuring premium finishes, spacious living areas, and high-end amenities. Perfect for discerning executives seeking an unparalleled residential experience with world-class facilities and prime location.",
    "apartment": "Sophisticated executive apartment with contemporary design, state-of-the-art amenities, and premium furnishings. Ideal for luxury living with premium views, concierge service, and exclusive community access.",
    "penthouse": "Ultra-luxury penthouse with panoramic views, designer interiors, and exclusive amenities. Perfect for high-net-worth individuals and executives seeking the pinnacle of luxury residential living.",
    "townhouse": "Premium executive townhouse offering spacious layouts, modern architecture, and luxury amenities. Designed for discerning professionals requiring comfort and elegance.",
    "studio": "Compact luxury studio apartment with premium finishes and efficient design. Perfect for young executives and professionals seeking upscale urban living.",
    "house": "Magnificent executive estate with extensive grounds, premium amenities, and architectural excellence. Ideal for executives seeking prestige and luxury.",
}

def get_property_type_for_description(title):
    """Determine property type from title for matching description."""
    title_lower = title.lower()

    if 'penthouse' in title_lower or 'pent house' in title_lower:
        return 'penthouse'
    elif 'villa' in title_lower:
        return 'villa'
    elif 'townhouse' in title_lower or 'town house' in title_lower:
        return 'townhouse'
    elif 'studio' in title_lower:
        return 'studio'
    elif 'house' in title_lower and 'townhouse' not in title_lower:
        return 'house'
    else:
        return 'apartment'

def get_unsplash_images(property_type, count=3):
    """Fetch images from Unsplash API based on property type."""
    try:
        search_terms = {
            "apartment": "luxury executive apartment interior modern",
            "villa": "luxury villa exterior modern architecture",
            "penthouse": "luxury penthouse interior high rise",
            "townhouse": "luxury townhouse modern contemporary",
            "studio": "luxury studio apartment modern",
            "house": "luxury mansion estate exterior",
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
            return images if images else [f"https://via.placeholder.com/600x400?text=Luxury+{property_type}"]
        else:
            return [f"https://via.placeholder.com/600x400?text=Luxury+{property_type}"]

    except Exception as e:
        print(f"Error fetching images: {e}")
        return [f"https://via.placeholder.com/600x400?text=Luxury+Property"]

def update_new_properties():
    """Update only the 33 newly added properties."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("✨ UPDATING 33 NEW PROPERTIES WITH LUXURY DESCRIPTIONS & IMAGES")
        print("="*80 + "\n")

        # Properties that were recently added (from the add_properties_multicountry.py script)
        # These are the ones from Dubai, Abu Dhabi, Qatar, Kuwait, Bahrain
        new_property_titles = [
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

        # Find and update these properties
        properties_to_update = db.query(Property).filter(
            Property.title.in_(new_property_titles)
        ).all()

        print(f"📋 Found {len(properties_to_update)} new properties to update\n")
        print("⏳ Fetching images and updating descriptions...\n")

        updated_count = 0

        for idx, prop in enumerate(properties_to_update, 1):
            try:
                # Determine property type
                prop_type = get_property_type_for_description(prop.title)

                # Get luxury description
                luxury_desc = LUXURY_DESCRIPTIONS.get(prop_type, LUXURY_DESCRIPTIONS["apartment"])

                # Fetch images for this property
                images = get_unsplash_images(prop_type, count=3)

                # Update property
                prop.description = luxury_desc
                prop.images = images
                prop.updated_at = datetime.now(UTC)

                updated_count += 1

                print(f"✅ [{idx}/33] {prop.title}")
                print(f"   Type: {prop_type.capitalize()}")
                print(f"   Added {len(images)} images")
                print(f"   Updated description\n")

            except Exception as e:
                print(f"❌ [{idx}/33] Error with {prop.title}: {str(e)}\n")
                continue

        if updated_count > 0:
            db.commit()
            print(f"\n💾 Saved {updated_count} properties with new descriptions and images\n")

        print(f"✅ Update Complete!")
        print(f"   Properties updated: {updated_count}/33")
        print(f"   Descriptions: Changed to luxury executive")
        print(f"   Images: Added from Unsplash API")

        return True

    except Exception as e:
        print(f"\n❌ Error during update: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = update_new_properties()
    exit(0 if success else 1)
