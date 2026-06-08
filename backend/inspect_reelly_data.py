#!/usr/bin/env python
"""
Inspect what data Reelly API actually returns for a property.
"""

import asyncio
from dotenv import load_dotenv

load_dotenv()

from services.reelly_client import ReelyApiClient

async def inspect():
    """Fetch one property and show all fields."""
    print("\n" + "="*80)
    print("🔍 INSPECTING REELLY API RESPONSE DATA")
    print("="*80 + "\n")

    async with ReelyApiClient() as client:
        print("📤 Fetching first property from Reelly...")

        async for project in client.get_properties_paginated(limit=1):
            print("\n✅ Sample Property Data:")
            print("="*80)
            import json
            print(json.dumps(project, indent=2, default=str))
            print("="*80)

            print("\n📋 Available Fields:")
            for key in project.keys():
                value = project.get(key)
                print(f"  • {key}: {type(value).__name__} = {value}")

            break

if __name__ == "__main__":
    asyncio.run(inspect())
