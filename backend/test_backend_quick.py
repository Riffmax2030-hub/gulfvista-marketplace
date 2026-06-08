#!/usr/bin/env python
"""
Quick Backend Test Script
Tests the core API endpoints after server restart.
Run this to verify the backend is working correctly.
"""

import requests
import json
import sys
from time import sleep

API_BASE = "http://localhost:8000"
API_V1 = f"{API_BASE}/api/v1"

def test_health():
    """Test health check endpoint."""
    print("\n📋 TEST 1: Health Check")
    print("-" * 50)
    try:
        response = requests.get(f"{API_BASE}/health", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False

def test_root():
    """Test root endpoint."""
    print("\n📋 TEST 2: Root Endpoint")
    print("-" * 50)
    try:
        response = requests.get(API_BASE, timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False

def test_register():
    """Test user registration."""
    print("\n📋 TEST 3: User Registration")
    print("-" * 50)
    try:
        payload = {
            "email": f"test_{int(__import__('time').time())}@gulfvista.test",
            "password": "Test123!@#",
            "full_name": "Test User",
            "phone": "+971501234567"
        }
        response = requests.post(f"{API_V1}/auth/register", json=payload, timeout=5)
        print(f"Status: {response.status_code}")
        if response.status_code in [200, 201]:
            data = response.json()
            print(f"✅ User created: {data.get('email')}")
            print(f"   ID: {data.get('id')}")
            print(f"   Role: {data.get('role')}")
            return True
        else:
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False

def test_list_properties():
    """Test property listing."""
    print("\n📋 TEST 4: List Properties")
    print("-" * 50)
    try:
        response = requests.get(f"{API_V1}/properties?limit=5", timeout=5)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Total properties: {data.get('total')}")
        print(f"Items returned: {len(data.get('items', []))}")
        if data.get('items'):
            print(f"First property: {data['items'][0].get('title')}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False

def test_database_tables():
    """Test that database tables were created."""
    print("\n📋 TEST 5: Database Tables Verification")
    print("-" * 50)
    try:
        from dotenv import load_dotenv
        load_dotenv()
        import config
        from database import engine
        from sqlalchemy import inspect

        required_tables = ['users', 'properties', 'leads', 'agents',
                         'agent_stats', 'property_sync_logs']

        inspector = inspect(engine)
        existing_tables = set(inspector.get_table_names())

        missing = [t for t in required_tables if t not in existing_tables]

        print(f"Total tables found: {len(existing_tables)}")
        print(f"Required tables: {len(required_tables)}")

        if missing:
            print(f"❌ Missing tables: {missing}")
            return False
        else:
            print(f"✅ All required tables exist!")
            print(f"   Tables: {', '.join(sorted(required_tables))}")
            return True
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False

def main():
    """Run all tests."""
    print("\n" + "="*70)
    print("🧪 GULFVISTA BACKEND QUICK TEST")
    print("="*70)

    # First check if server is running
    print("\nℹ️  Checking if server is running at", API_BASE)
    try:
        requests.get(API_BASE, timeout=2)
        print("✅ Server is running!\n")
    except Exception as e:
        print(f"\n❌ Server is NOT running at {API_BASE}")
        print(f"Error: {e}")
        print("\n🔧 Please start the server:")
        print("   cd C:\\Users\\DATA ENG. OLA\\Desktop\\gulfvista.properties\\backend")
        print("   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        return False

    # Run tests
    tests = [
        ("Health Check", test_health),
        ("Root Endpoint", test_root),
        ("User Registration", test_register),
        ("List Properties", test_list_properties),
        ("Database Tables", test_database_tables),
    ]

    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ Unexpected error in {test_name}: {e}")
            results[test_name] = False

    # Summary
    print("\n" + "="*70)
    print("📊 TEST SUMMARY")
    print("="*70)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:10} - {test_name}")

    print(f"\nResult: {passed}/{total} tests passed ({passed/total*100:.0f}%)")

    if passed == total:
        print("\n🎉 All tests passed! Backend is working correctly.")
        return True
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    print("\n" + "="*70 + "\n")
    sys.exit(0 if success else 1)
