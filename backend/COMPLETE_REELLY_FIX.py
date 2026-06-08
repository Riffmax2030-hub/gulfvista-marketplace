#!/usr/bin/env python
"""
COMPLETE REELLY API FIX & CLEANUP
Clears caches, logs, verifies configuration, and tests Reelly API connection.
Run this to ensure Reelly API integration is fully working.
"""

import os
import sys
import glob
from pathlib import Path
from dotenv import load_dotenv
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Load environment
load_dotenv()

def clear_logs_and_caches():
    """Clear old logs, caches, and temporary files."""
    print("\n" + "="*80)
    print("🧹 STEP 1: Clearing Logs & Caches")
    print("="*80 + "\n")

    items_cleared = 0

    # Patterns to clean
    patterns = [
        "*.log",
        "__pycache__",
        "*.pyc",
        ".pytest_cache",
        ".coverage",
        "*.egg-info",
        ".env.bak",
        ".env.old",
        "gulfvista*.log*",
    ]

    # Current directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))

    for pattern in patterns:
        # Find files matching pattern
        for item in glob.glob(os.path.join(backend_dir, pattern)):
            try:
                if os.path.isfile(item):
                    os.remove(item)
                    print(f"✅ Removed: {os.path.basename(item)}")
                    items_cleared += 1
                elif os.path.isdir(item):
                    import shutil
                    shutil.rmtree(item)
                    print(f"✅ Removed directory: {os.path.basename(item)}")
                    items_cleared += 1
            except Exception as e:
                print(f"⚠️  Could not remove {item}: {e}")

    # Also check in services, jobs, routes subdirectories
    subdirs = ["services", "jobs", "routes"]
    for subdir in subdirs:
        subdir_path = os.path.join(backend_dir, subdir)
        if os.path.isdir(subdir_path):
            for pattern in ["__pycache__", "*.pyc", ".pytest_cache"]:
                for item in glob.glob(os.path.join(subdir_path, pattern)):
                    try:
                        if os.path.isdir(item):
                            import shutil
                            shutil.rmtree(item)
                            print(f"✅ Removed: {os.path.relpath(item)}")
                            items_cleared += 1
                    except Exception as e:
                        print(f"⚠️  Could not remove {item}: {e}")

    print(f"\n✅ Cleared {items_cleared} items\n")
    return True

def verify_env_file():
    """Verify .env file has all required Reelly settings."""
    print("="*80)
    print("🔍 STEP 2: Verifying Environment Configuration")
    print("="*80 + "\n")

    env_path = os.path.join(os.path.dirname(__file__), ".env")

    if not os.path.exists(env_path):
        print(f"❌ .env file not found at {env_path}")
        return False

    print(f"✅ Found .env at {env_path}\n")

    # Read .env file
    with open(env_path, 'r') as f:
        env_content = f.read()

    # Check for required settings
    required_settings = [
        "DATABASE_URL",
        "SECRET_KEY",
        "REELLY_API_KEY",
    ]

    missing = []
    for setting in required_settings:
        if setting in env_content:
            # Get the value (masked for sensitive data)
            for line in env_content.split('\n'):
                if line.startswith(setting + "="):
                    value = line.split('=', 1)[1]
                    if setting == "REELLY_API_KEY":
                        display_value = f"{value[:10]}...{value[-5:]}" if len(value) > 15 else "***"
                    elif setting == "SECRET_KEY":
                        display_value = "***"
                    else:
                        display_value = value[:50] + "..." if len(value) > 50 else value
                    print(f"✅ {setting:20} = {display_value}")
                    break
        else:
            print(f"❌ {setting:20} - MISSING!")
            missing.append(setting)

    if missing:
        print(f"\n⚠️  Missing settings: {', '.join(missing)}")
        print("Please add these to your .env file!")
        return False

    print("\n✅ All required settings present\n")
    return True

def verify_config_file():
    """Verify config.py has correct Reelly API URL."""
    print("="*80)
    print("🔍 STEP 3: Verifying Configuration File")
    print("="*80 + "\n")

    try:
        import config

        # Check Reelly configuration
        print(f"Database URL:     {config.DATABASE_URL[:50]}...")
        print(f"Reelly API Key:   {config.REELLY_API_KEY[:10]}...{config.REELLY_API_KEY[-5:] if len(config.REELLY_API_KEY) > 15 else '***'}")
        print(f"Reelly Base URL:  {config.REELLY_BASE_URL}")

        # Verify correct v2.0 base URL
        if "api-reelly.up.railway.app" in config.REELLY_BASE_URL:
            print("\n✅ Correct Reelly API v2.0 URL")
        else:
            print(f"\n❌ Wrong Reelly API URL!")
            print(f"   Expected: https://api-reelly.up.railway.app/api/v2/clients")
            print(f"   Got:      {config.REELLY_BASE_URL}")
            return False

        print("✅ Configuration looks good\n")
        return True

    except Exception as e:
        print(f"❌ Error loading config: {e}\n")
        return False

async def test_reelly_connection():
    """Test connection to Reelly API."""
    print("="*80)
    print("🔌 STEP 4: Testing Reelly API Connection")
    print("="*80 + "\n")

    try:
        import config
        import httpx

        print(f"Testing connection to: {config.REELLY_BASE_URL}")
        print(f"Using API Key: {config.REELLY_API_KEY[:10]}...\n")

        # Direct HTTP test (simple and reliable)
        headers = {
            "X-API-Key": config.REELLY_API_KEY,
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient() as client:
            # Try to fetch projects with limit=1 (lightweight test)
            response = await client.get(
                f"{config.REELLY_BASE_URL}/projects",
                params={"limit": 1},
                headers=headers,
                timeout=30
            )

            print(f"API Response Status: {response.status_code}")

            if response.status_code == 200:
                print("✅ Reelly API connection successful!")
                print("✅ API key is valid!")

                try:
                    data = response.json()
                    count = data.get("count", 0)
                    results = data.get("results", [])
                    print(f"\n📊 Found {count} total properties in Reelly")

                    if results:
                        project = results[0]
                        print(f"✅ Got sample project: {project.get('name', 'Unknown')}")
                        print(f"   ID: {project.get('id')}")
                    else:
                        print("⚠️  No projects available yet (but API is working)")

                    print("\n✅ Reelly API is fully functional!\n")
                    return True
                except Exception as e:
                    print(f"⚠️  Could not parse response: {e}")
                    return True  # API is working even if we can't parse

            elif response.status_code == 401:
                print("❌ Unauthorized - API key is invalid!")
                print(f"Response: {response.text[:200]}\n")
                return False
            elif response.status_code == 403:
                print("❌ Forbidden - API key doesn't have access!")
                print(f"Response: {response.text[:200]}\n")
                return False
            else:
                print(f"❌ API error: {response.status_code}")
                print(f"Response: {response.text[:200]}\n")
                return False

    except Exception as e:
        print(f"❌ Connection test failed: {str(e)}\n")
        import traceback
        traceback.print_exc()
        return False

def verify_reelly_client():
    """Verify reelly_client.py has correct implementation."""
    print("="*80)
    print("🔍 STEP 5: Verifying Reelly Client Implementation")
    print("="*80 + "\n")

    try:
        reelly_client_path = os.path.join(
            os.path.dirname(__file__),
            "services",
            "reelly_client.py"
        )

        # Read with encoding handling
        try:
            with open(reelly_client_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            with open(reelly_client_path, 'r', encoding='latin-1') as f:
                content = f.read()

        # Check for v2.0 features
        checks = [
            ("X-API-Key header", "X-API-Key" in content),
            ("Pagination support", "get_projects_paginated" in content),
            ("Correct API URL comment", "api-reelly.up.railway.app" in content),
        ]

        all_good = True
        for check_name, result in checks:
            status = "✅" if result else "❌"
            print(f"{status} {check_name}")
            if not result:
                all_good = False

        if all_good:
            print("\n✅ Reelly client implementation is correct\n")
        else:
            print("\n❌ Reelly client needs fixes\n")

        return all_good

    except Exception as e:
        print(f"❌ Error checking reelly_client.py: {e}\n")
        return False

def main():
    """Run all checks and fixes."""
    print("\n" + "="*80)
    print("🚀 COMPLETE REELLY API FIX & VERIFICATION")
    print("="*80)

    results = {
        "Clear logs/caches": clear_logs_and_caches(),
        "Verify .env": verify_env_file(),
        "Verify config": verify_config_file(),
        "Verify client code": verify_reelly_client(),
    }

    # Test API connection (async)
    print("="*80)
    print("🔌 STEP 4: Testing Reelly API Connection")
    print("="*80 + "\n")

    try:
        import asyncio
        api_test = asyncio.run(test_reelly_connection())
        results["API connection"] = api_test
    except Exception as e:
        print(f"❌ Could not test API connection: {e}\n")
        results["API connection"] = False

    # Summary
    print("="*80)
    print("📊 FIX SUMMARY")
    print("="*80 + "\n")

    for check, status in results.items():
        symbol = "✅" if status else "❌"
        print(f"{symbol} {check}")

    all_passed = all(results.values())

    if all_passed:
        print("\n" + "="*80)
        print("✅ ALL CHECKS PASSED!")
        print("="*80)
        print("\n🚀 Ready to start server:")
        print("   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        print("\n📥 Properties will be synced from Reelly automatically!")
        print("\n")
        return True
    else:
        print("\n" + "="*80)
        print("❌ SOME CHECKS FAILED")
        print("="*80)
        print("\nPlease review the errors above and fix them.")
        print("\nCommon issues:")
        print("1. REELLY_API_KEY not in .env file")
        print("2. Wrong API key (invalid or expired)")
        print("3. Reelly API is down (check https://api-reelly.up.railway.app)")
        print("\n")
        return False

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⛔ Cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
