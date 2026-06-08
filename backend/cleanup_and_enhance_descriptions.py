#!/usr/bin/env python
"""
1. Remove "Project general facts" from all 49 original properties
2. Enhance descriptions with Reelly-style luxury property language
"""

from dotenv import load_dotenv
from database import SessionLocal
from models import Property
from datetime import datetime, UTC
import re

load_dotenv()

# Reelly-style luxury property descriptions by type and location pattern
LUXURY_DESCRIPTIONS_BY_TYPE = {
    "apartment": {
        "opening": "This exceptional {location} apartment epitomizes modern luxury living, blending sophisticated design with premium comfort. A testament to refined architectural excellence, this residence offers a sanctuary of elegance and tranquility.",
        "design": "The interior showcases thoughtfully curated spaces with expansive floor-to-ceiling windows that flood each room with natural light. Warm neutrals, jewel tones, and layered textures create an atmosphere of understated opulence. Feature walls with vertical detailing and metallic accents gleam under carefully positioned lighting.",
        "amenities": "Fully equipped with world-class appliances and premium finishes, the kitchen seamlessly integrates functionality with aesthetic appeal. Every detail, from spatial organization to material palette and lighting design, reflects purposeful luxury.",
        "location": "Positioned in a prestigious {location}, this development merges contemporary vision with timeless elegance, where architecture redefines the residential experience. Living here transcends the ordinary.",
        "closing": "A serene sanctuary offering wellness woven into exceptional design, where every moment is enriched with purpose and distinction."
    },
    "villa": {
        "opening": "Discover unparalleled luxury in this magnificent {location} villa, a masterpiece of architectural sophistication and refined living. This exclusive residence captures the essence of island living with unmatched craftsmanship.",
        "design": "The thoughtfully designed interiors showcase curved, flowing lines and premium finishes that merge artistry with structural ingenuity. Panoramic vistas flood the space, accentuating warm palettes and layered textures. Gold and brass accents add refined opulence throughout.",
        "amenities": "Expansive spaces prioritize functionality, sustainability, and seamless living. The fully furnished villa features world-class amenities, gourmet spaces, and spa-like sanctuaries that blend beauty with modern sophistication.",
        "location": "Located on a prestigious waterfront development, this villa offers breathtaking views of the pristine coastline. The curated landscape fosters serenity and balance, creating a haven of tranquility.",
        "closing": "An exclusive retreat where precision meets comfort, embracing understated opulence and redefining the art of contemporary luxury living."
    },
    "penthouse": {
        "opening": "Experience the pinnacle of luxury in this breathtaking {location} penthouse, a commanding statement of modernity and grandeur. This ultra-exclusive residence offers unparalleled panoramic views and sophisticated design.",
        "design": "Every detail reflects meticulous attention to craftsmanship, from the expansive French windows that showcase stunning vistas to the premium material palette. Metallic trims and strategic lighting create an elevated, serene atmosphere. Spiritual undertones and curated elements evoke purpose-driven design.",
        "amenities": "Exceptional amenities include fully equipped culinary spaces, premium wellness facilities, and lavishly appointed living areas. The penthouse prioritizes both comfort and elegance, with every feature serving a purposeful role.",
        "location": "Perched in one of the region's most prestigious developments, this penthouse captures waterfront magnificence with culturally rich sophistication. The location merges legacy with contemporary vision.",
        "closing": "An incomparable sanctuary where luxury transcends expectations, offering a lifestyle of unmatched refinement and distinction."
    },
    "townhouse": {
        "opening": "This contemporary {location} townhouse represents the pinnacle of modern residential design, merging spacious living with architectural sophistication. A refined retreat for discerning homeowners seeking premium comfort.",
        "design": "The thoughtfully designed layout maximizes space while maintaining an atmosphere of elegant simplicity. Premium finishes, neutral palettes, and carefully curated details create a cohesive aesthetic throughout.",
        "amenities": "Fully furnished with quality appliances and contemporary fixtures, the townhouse features multiple living areas, premium bedrooms, and sophisticated entertaining spaces. Each room reflects purposeful design and comfort.",
        "location": "Situated in an established {location}, this development offers convenient access to premium amenities while maintaining a serene residential environment. The community fosters balance and quality of life.",
        "closing": "An elegant sanctuary offering modern comfort and sophisticated living for those who appreciate refined design and thoughtful construction."
    },
    "studio": {
        "opening": "This sophisticated {location} studio apartment captures luxury in an efficient, beautifully designed space. Perfect for professionals seeking upscale urban living with contemporary sophistication.",
        "design": "Expertly designed to maximize functionality, the studio features clean lines, premium finishes, and smart spatial organization. Natural light and carefully curated details create an atmosphere of refined elegance.",
        "amenities": "Fully equipped with quality appliances and modern fixtures, the studio provides all essentials for sophisticated urban living. Premium materials and thoughtful design distinguish this residence.",
        "location": "Located in a prestigious {location} development, this studio offers proximity to world-class amenities and vibrant urban culture. The perfect setting for the discerning professional.",
        "closing": "An elegant compact retreat offering luxury living and convenience in one beautifully appointed space."
    }
}

def get_property_type(title):
    """Determine property type from title."""
    title_lower = title.lower()

    if 'penthouse' in title_lower or 'pent house' in title_lower:
        return 'penthouse'
    elif 'villa' in title_lower:
        return 'villa'
    elif 'townhouse' in title_lower or 'town house' in title_lower:
        return 'townhouse'
    elif 'studio' in title_lower:
        return 'studio'
    else:
        return 'apartment'

def create_luxury_description(title, city, property_type):
    """Create a Reelly-style luxury description."""
    template = LUXURY_DESCRIPTIONS_BY_TYPE.get(property_type, LUXURY_DESCRIPTIONS_BY_TYPE['apartment'])

    description_parts = [
        template['opening'].format(location=city),
        template['design'],
        template['amenities'],
        template['location'].format(location=city),
        template['closing']
    ]

    return '\n\n'.join(description_parts)

def cleanup_and_enhance():
    """Remove 'Project general facts' and enhance descriptions."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("✨ CLEANING UP AND ENHANCING PROPERTY DESCRIPTIONS")
        print("="*80 + "\n")

        # Get all properties
        properties = db.query(Property).all()

        print(f"📋 Found {len(properties)} properties\n")

        removed_count = 0
        enhanced_count = 0

        for idx, prop in enumerate(properties, 1):
            try:
                original_desc = prop.description
                updated = False

                # Remove "Project general facts" and related headers
                if original_desc and "Project general facts" in original_desc:
                    # Remove the phrase and any markdown headers around it
                    cleaned_desc = re.sub(
                        r'#{1,5}\s*Project general facts\s*\n*',
                        '',
                        original_desc,
                        flags=re.IGNORECASE
                    )
                    # Also remove standalone "Project general facts" without markdown
                    cleaned_desc = re.sub(
                        r'Project general facts\s*\n*',
                        '',
                        cleaned_desc,
                        flags=re.IGNORECASE
                    )
                    # Remove leading whitespace
                    cleaned_desc = cleaned_desc.strip()

                    prop.description = cleaned_desc
                    removed_count += 1
                    updated = True

                # Enhance with luxury descriptions if too short or generic
                if prop.description and (len(prop.description) < 200 or "Modern" in prop.description and "Apartment" in prop.description):
                    prop_type = get_property_type(prop.title)
                    new_desc = create_luxury_description(prop.title, prop.city, prop_type)
                    prop.description = new_desc
                    enhanced_count += 1
                    updated = True

                if updated:
                    prop.updated_at = datetime.now(UTC)
                    print(f"✅ [{idx}/{len(properties)}] {prop.title}")
                    if removed_count > 0 and prop.description != original_desc:
                        if "Project general facts" in original_desc:
                            print(f"   Removed 'Project general facts'")
                        if len(prop.description) > 200:
                            print(f"   Enhanced with luxury description")
                    print()

            except Exception as e:
                print(f"❌ [{idx}/{len(properties)}] Error with {prop.title}: {str(e)}\n")
                continue

        if removed_count > 0 or enhanced_count > 0:
            db.commit()
            print(f"\n💾 Saved {removed_count + enhanced_count} updated properties\n")

        print(f"✅ Cleanup Complete!")
        print(f"   'Project general facts' removed: {removed_count}")
        print(f"   Descriptions enhanced: {enhanced_count}")
        print(f"   Total improved: {removed_count + enhanced_count}")

        return True

    except Exception as e:
        print(f"\n❌ Error during cleanup: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = cleanup_and_enhance()
    exit(0 if success else 1)
