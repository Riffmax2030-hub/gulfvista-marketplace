"""
Mock data for development and testing.
Seed file to populate the database with realistic sample properties and users.
"""

from database import SessionLocal, init_db
from models import (
    User, Property, PropertyType, UserRole, Transaction, PaymentStatus
)
from auth import AuthenticationService
from datetime import datetime, UTC
import uuid

# Sample property images (using placeholder service)
SAMPLE_IMAGES = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    "https://images.unsplash.com/photo-1600566753086-00f18a0505f9?w=800",
]

FLOOR_PLAN_IMAGES = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
]

# Sample developers
DEVELOPERS = [
    {
        "name": "Emaar Properties",
        "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Emaar_logo.svg/1200px-Emaar_logo.svg.png",
    },
    {
        "name": "Damac Properties",
        "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/DAMAC_logo.svg/1280px-DAMAC_logo.svg.png",
    },
    {
        "name": "Azizi Developments",
        "logo": "https://www.azizi.ae/assets/logo.png",
    },
]

SAMPLE_PROPERTIES = [
    {
        "title": "Luxury 3BR Apartment in Downtown Dubai",
        "description": "Stunning high-rise apartment with panoramic views of Burj Khalifa. Features premium finishes, smart home automation, and access to world-class amenities including gym, spa, and concierge service.",
        "property_type": PropertyType.APARTMENT,
        "price": 2500000.0,
        "address": "Downtown Dubai, Burj Khalifa Tower",
        "city": "Dubai",
        "emirate": "Dubai",
        "bedrooms": 3,
        "bathrooms": 2,
        "area_sqft": 2100,
        "year_built": 2022,
        "furnishing": "luxury",
        "latitude": 25.1972,
        "longitude": 55.2744,
        "developer_name": "Emaar Properties",
        "project_name": "Burj Khalifa Residences",
    },
    {
        "title": "Modern 4BR Villa in Arabian Ranches",
        "description": "Spectacular contemporary villa with private garden, heated infinity pool, and smart automation system. Located in the prestigious Arabian Ranches community with 24/7 security and golf course access.",
        "property_type": PropertyType.VILLA,
        "price": 3500000.0,
        "address": "Arabian Ranches, Villa Community",
        "city": "Dubai",
        "emirate": "Dubai",
        "bedrooms": 4,
        "bathrooms": 3,
        "area_sqft": 5000,
        "year_built": 2023,
        "furnishing": "semi-furnished",
        "latitude": 25.0849,
        "longitude": 55.1621,
        "developer_name": "Damac Properties",
        "project_name": "Arabian Ranches 3",
    },
    {
        "title": "Premium 2BR Apartment in Marina Dubai",
        "description": "Exquisite apartment with full marina and sea views. High-end fixtures, walk-in closets, and private balcony. Building amenities include pool, gym, yoga studio, and rooftop lounge.",
        "property_type": PropertyType.APARTMENT,
        "price": 1800000.0,
        "address": "Dubai Marina, Marina Crescent",
        "city": "Dubai",
        "emirate": "Dubai",
        "bedrooms": 2,
        "bathrooms": 2,
        "area_sqft": 1450,
        "year_built": 2021,
        "furnishing": "furnished",
        "latitude": 25.0853,
        "longitude": 55.1396,
        "developer_name": "Emaar Properties",
        "project_name": "Marina Crescent",
    },
    {
        "title": "Investment Land Plot in Business Bay",
        "description": "Prime commercial land plot with high ROI potential. Perfect location for development projects with easy access to major business district and excellent connectivity.",
        "property_type": PropertyType.LAND,
        "price": 5000000.0,
        "address": "Business Bay, Development Area",
        "city": "Dubai",
        "emirate": "Dubai",
        "area_sqft": 50000,
        "latitude": 25.1866,
        "longitude": 55.2519,
        "developer_name": "Azizi Developments",
        "project_name": "Business Bay Commercial",
    },
]

SAMPLE_USERS = [
    {
        "email": "agent@gulfvista.properties",
        "full_name": "Ahmed Al-Mansouri",
        "password": "SecurePassword123!",
        "role": UserRole.AGENT_ADMIN,
        "company_name": "Premium Real Estate Group",
        "phone": "+971501234567",
        "is_agent_verified": True,
    },
    {
        "email": "buyer@gulfvista.properties",
        "full_name": "Sarah Johnson",
        "password": "SecurePassword123!",
        "role": UserRole.BUYER,
        "phone": "+971505555555",
        "is_agent_verified": False,
    },
    {
        "email": "seller@gulfvista.properties",
        "full_name": "Mohammed Al-Ahly",
        "password": "SecurePassword123!",
        "role": UserRole.SELLER,
        "phone": "+971509999999",
        "is_agent_verified": False,
    },
]


def seed_database() -> None:
    """
    Populate the database with mock data for development.
    Safe to run multiple times - checks for existing data.
    """
    db = SessionLocal()

    try:
        # Skip if users already exist (prevents duplicate seeding)
        if db.query(User).count() > 0:
            print("Database already seeded. Skipping...")
            return

        # Create users
        created_users = []
        for user_data in SAMPLE_USERS:
            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=AuthenticationService.hash_password(user_data["password"]),
                phone=user_data.get("phone"),
                role=user_data["role"],
                company_name=user_data.get("company_name"),
                is_agent_verified=user_data["is_agent_verified"],
                is_active=True,
            )
            db.add(user)
            created_users.append(user)

        db.commit()
        print(f"✓ Created {len(created_users)} sample users")

        # Create properties
        agent_user = db.query(User).filter(User.role == UserRole.AGENT_ADMIN).first()
        created_properties = []

        for prop_data in SAMPLE_PROPERTIES:
            property_obj = Property(
                title=prop_data["title"],
                description=prop_data["description"],
                property_type=prop_data["property_type"],
                price=prop_data["price"],
                currency="AED",
                address=prop_data["address"],
                city=prop_data["city"],
                emirate=prop_data["emirate"],
                country="UAE",
                bedrooms=prop_data.get("bedrooms"),
                bathrooms=prop_data.get("bathrooms"),
                area_sqft=prop_data.get("area_sqft"),
                year_built=prop_data.get("year_built"),
                furnishing=prop_data.get("furnishing"),
                images=SAMPLE_IMAGES,
                floor_plans=FLOOR_PLAN_IMAGES,
                latitude=prop_data.get("latitude"),
                longitude=prop_data.get("longitude"),
                developer_name=prop_data.get("developer_name"),
                project_name=prop_data.get("project_name"),
                source_id=f"mock_{uuid.uuid4()}",
                source_platform="reelly",
                is_active=True,
                is_featured=True,
                owner_id=agent_user.id if agent_user else None,
            )
            db.add(property_obj)
            created_properties.append(property_obj)

        db.commit()
        print(f"✓ Created {len(created_properties)} sample properties")

        # Create sample transaction (for agent verification)
        if agent_user and not db.query(Transaction).filter(
            Transaction.user_id == agent_user.id
        ).first():
            transaction = Transaction(
                user_id=agent_user.id,
                stripe_session_id=f"mock_session_{uuid.uuid4()}",
                amount_cents=20000,  # $200
                currency="USD",
                transaction_type="agent_registration",
                description="Agent registration fee",
                status=PaymentStatus.COMPLETED,
                metadata={},
                completed_at=datetime.now(UTC),
            )
            db.add(transaction)
            db.commit()
            print("✓ Created sample transaction for verified agent")

        print("\n✅ Database seeding completed successfully!")
        print("\nSample credentials for testing:")
        for user in SAMPLE_USERS:
            print(f"  • {user['email']} / {user['password']}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    seed_database()
