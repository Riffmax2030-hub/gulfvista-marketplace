#!/usr/bin/env python
"""
Clean up property descriptions by removing "Project general facts" header.
Runs against the local database and updates all properties.
"""

import asyncio
from dotenv import load_dotenv
from database import SessionLocal
from models import Property

load_dotenv()

def clean_description(description):
    """Remove 'Project general facts' and other unwanted headers from description."""
    if not description:
        return ''

    lines = description.split('\n')
    cleaned_lines = []

    for line in lines:
        # Skip lines that are just headers or the unwanted phrase
        if 'Project general facts' in line:
            continue
        if line.strip().startswith('#'):
            continue
        if not line.strip():  # Skip empty lines at start
            if cleaned_lines:  # But keep empty lines in middle/end
                cleaned_lines.append(line)
        else:
            cleaned_lines.append(line)

    # Remove leading empty lines
    while cleaned_lines and not cleaned_lines[0].strip():
        cleaned_lines.pop(0)

    # Remove trailing empty lines
    while cleaned_lines and not cleaned_lines[-1].strip():
        cleaned_lines.pop()

    return '\n'.join(cleaned_lines).strip()


def cleanup_all_descriptions():
    """Clean descriptions for all properties in database."""
    db = SessionLocal()

    try:
        print("\n" + "="*80)
        print("🧹 CLEANING PROPERTY DESCRIPTIONS")
        print("="*80 + "\n")

        # Get all properties
        properties = db.query(Property).all()

        if not properties:
            print("⚠️  No properties found in database")
            return False

        print(f"📋 Found {len(properties)} properties\n")

        updated_count = 0

        for prop in properties:
            original = prop.description
            cleaned = clean_description(original)

            # Only update if description changed
            if original != cleaned:
                prop.description = cleaned
                updated_count += 1
                print(f"✅ Updated: {prop.title}")
                if 'Project general facts' in original:
                    print(f"   Removed 'Project general facts' header")

        # Commit changes
        if updated_count > 0:
            db.commit()
            print(f"\n💾 Saved changes to database")

        print(f"\n✅ Cleanup Complete!")
        print(f"   Properties cleaned: {updated_count}/{len(properties)}")

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
    success = cleanup_all_descriptions()
    exit(0 if success else 1)
