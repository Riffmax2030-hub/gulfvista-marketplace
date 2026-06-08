#!/usr/bin/env python
"""
Quick Property Seeding Script
Loads sample properties into the database for testing.
Run this to populate properties immediately without waiting for Reelly API.
"""

import sys
import os
from dotenv import load_dotenv
from datetime import datetime, UTC

# Load environment
load_dotenv()

from database import SessionLocal
from models import Property, PropertyType, User, UserRole

def seed_properties():
    """Add sample properties to database."""

    print("\n" + "="*80)
    print("🌱 PROPERTY SEEDING - Loading Sample Properties")
    print("="*80 + "\n")

    db = SessionLocal()

    try:
        # First, get or create a test seller/agent user
        print("📋 Setting up test seller account...")
        seller = db.query(User).filter(User.email == "seller@gulfvista.test").first()

        if not seller:
            seller = User(
                email="seller@gulfvista.test",
                full_name="Test Seller",
                hashed_password="hashed_pw_test",
                role=UserRole.SELLER,
                is_active=True,
                phone="+971501234567"
            )
            db.add(seller)
            db.commit()
            print(f"✅ Created seller: {seller.email}\n")
        else:
            print(f"✅ Using existing seller: {seller.email}\n")

        # Sample properties data
        sample_properties = [
            {
                "title": "Luxury Apartment in Downtown Dubai",
                "description": "Modern 2-bed apartment with stunning marina views, perfect for professionals.",
                "property_type": PropertyType.APARTMENT,
                "price": 850000.0,
                "currency": "AED",
                "address": "123 Sheikh Zayed Road, Downtown Dubai",
                "city": "Dubai",
                "emirate": "Dubai",
                "bedrooms": 2,
                "bathrooms": 2,
                "area_sqft": 1200.0,
                "year_built": 2022,
                "furnishing": "furnished",
                "images": [
                    "https://via.placeholder.com/600x400?text=Luxury+Apt+1",
                    "https://via.placeholder.com/600x400?text=Luxury+Apt+2",
                ],
            },
            {
                "title": "Spacious Villa in Arabian Ranches",
                "description": "4-bedroom villa with private pool and garden in the heart of Arabian Ranches.",
                "property_type": PropertyType.VILLA,
                "price": 2500000.0,
                "currency": "AED",
                "address": "456 Arabian Ranches Road, Dubai",
                "city": "Dubai",
                "emirate": "Dubai",
                "bedrooms": 4,
                "bathrooms": 3,
                "area_sqft": 4500.0,
                "year_built": 2020,
                "furnishing": "semi-furnished",
                "images": [
                    "https://via.placeholder.com/600x400?text=Villa+1",
                    "https://via.placeholder.com/600x400?text=Villa+2",
                ],
            },
            {
                "title": "Modern Townhouse in Jumeirah Village Circle",
                "description": "Contemporary townhouse with 3 bedrooms, close to schools and shopping centers.",
                "property_type": PropertyType.TOWNHOUSE,
                "price": 1200000.0,
                "currency": "AED",
                "address": "789 JVC District, Dubai",
                "city": "Dubai",
                "emirate": "Dubai",
                "bedrooms": 3,
                "bathrooms": 2.5,
                "area_sqft": 2000.0,
                "year_built": 2021,
                "furnishing": "unfurnished",
                "images": [
                    "https://via.placeholder.com/600x400?text=Townhouse+1",
                    "https://via.placeholder.com/600x400?text=Townhouse+2",
                ],
            },
            {
                "title": "Premium Office Space in DIFC",
                "description": "Fully equipped office space in Dubai International Financial Centre.",
                "property_type": PropertyType.OFFICE,
                "price": 500000.0,
                "currency": "AED",
                "address": "321 DIFC, Dubai",
                "city": "Dubai",
                "emirate": "Dubai",
                "bedrooms": None,
                "bathrooms": 2,
                "area_sqft": 3000.0,
                "year_built": 2019,
                "furnishing": "furnished",
                "images": [
                    "https://via.placeholder.com/600x400?text=Office+1",
                ],
            },
            {
                "title": "Commercial Shop in Dubai Mall",
                "description": "High-traffic retail space in one of the world's largest malls.",
                "property_type": PropertyType.COMMERCIAL,
                "price": 750000.0,
                "currency": "AED",
                "address": "100 Dubai Mall, Downtown Dubai",
                "city": "Dubai",
                "emirate": "Dubai",
                "bedrooms": None,
                "bathrooms": 1,
                "area_sqft": 500.0,
                "year_built": 2008,
                "furnishing": "furnished",
                "images": [
                    "https://via.placeholder.com/600x400?text=Shop+1",
                ],
            },
            {
                "title": "Prime Land Plot in Business Bay",
                "description": "Large land plot ready for development in Business Bay.",
                "property_type": PropertyType.LAND,
                "price": 5000000.0,
                "currency": "AED",
                "address": "555 Business Bay, Dubai",
                "city": "Dubai",
                "emirate": "Dubai",
                "bedrooms": None,
                "bathrooms": None,
                "area_sqft": 20000.0,
                "year_built": None,
                "furnishing": None,
                "images": [
                    "https://via.placeholder.com/600x400?text=Land+Plot",
                ],
            },
        ]

        # Insert sample properties
        print("📝 Adding sample properties...\n")
        created_count = 0
        skipped_count = 0

        for prop_data in sample_properties:
            # Check if property already exists
            existing = db.query(Property).filter(
                Property.title == prop_data["title"]
            ).first()

            if existing:
                print(f"⏭️  Skipped: {prop_data['title']} (already exists)")
                skipped_count += 1
                continue

            # Create new property
            prop = Property(
                title=prop_data["title"],
                description=prop_data["description"],
                property_type=prop_data["property_type"],
                price=prop_data["price"],
                currency=prop_data["currency"],
                address=prop_data["address"],
                city=prop_data["city"],
                emirate=prop_data["emirate"],
                bedrooms=prop_data["bedrooms"],
                bathrooms=prop_data["bathrooms"],
                area_sqft=prop_data["area_sqft"],
                year_built=prop_data["year_built"],
                furnishing=prop_data["furnishing"],
                images=prop_data["images"],
                owner_id=seller.id,
                is_active=True,
            )
            db.add(prop)
            created_count += 1
            print(f"✅ Added: {prop_data['title']}")

        # Commit all properties
        if created_count > 0:
            db.commit()
            print(f"\n✅ Successfully added {created_count} properties")

        if skipped_count > 0:
            print(f"⏭️  Skipped {skipped_count} properties (already in database)")

        # Verify
        total_properties = db.query(Property).count()
        print(f"\n📊 Total properties in database: {total_properties}")

        print("\n" + "="*80)
        print("✅ PROPERTY SEEDING COMPLETE!")
        print("="*80)
        print("\n🚀 Next steps:")
        print("   1. Test the API: curl http://localhost:8000/api/v1/properties")
        print("   2. Properties should now be available in the frontend")
        print("   3. When Reelly API is configured, it will sync additional properties")
        print("\n")

        return True

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False

    finally:
        db.close()

if __name__ == "__main__":
    success = seed_properties()
    sys.exit(0 if success else 1)
