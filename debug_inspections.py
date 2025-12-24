#!/usr/bin/env python3
"""
Debug script to test inspection creation and identify network errors.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import requests
import json

def test_inspection_api():
    """Test the inspection API endpoints."""
    print("🔍 Testing Inspection API Endpoints")
    print("=" * 50)
    
    # Test backend health
    backend_url = "https://web-production-6e2c.up.railway.app"
    
    print("1. Testing backend health...")
    try:
        response = requests.get(f"{backend_url}/health", timeout=10)
        print(f"   ✅ Backend health: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Backend health failed: {e}")
        return
    
    # Test auth endpoint
    print("2. Testing auth endpoint...")
    try:
        response = requests.post(f"{backend_url}/api/v1/auth/login/json", 
                               json={"email": "test@example.com", "password": "test"}, 
                               timeout=10)
        print(f"   📡 Auth endpoint responds: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Auth endpoint failed: {e}")
    
    # Test properties endpoint
    print("3. Testing properties endpoint...")
    try:
        response = requests.get(f"{backend_url}/api/v1/properties", timeout=10)
        print(f"   📡 Properties endpoint responds: {response.status_code}")
        if response.status_code == 401:
            print("   ℹ️  401 Unauthorized is expected without auth token")
    except Exception as e:
        print(f"   ❌ Properties endpoint failed: {e}")
    
    # Test inspections endpoint
    print("4. Testing inspections endpoint...")
    try:
        response = requests.get(f"{backend_url}/api/v1/inspections", timeout=10)
        print(f"   📡 Inspections endpoint responds: {response.status_code}")
        if response.status_code == 401:
            print("   ℹ️  401 Unauthorized is expected without auth token")
    except Exception as e:
        print(f"   ❌ Inspections endpoint failed: {e}")
    
    # Test inspection creation endpoint
    print("5. Testing inspection creation endpoint...")
    try:
        test_data = {
            "property_id": 1,
            "inspection_type": "move_in",
            "notes": "Test inspection"
        }
        response = requests.post(f"{backend_url}/api/v1/inspections", 
                               json=test_data, 
                               timeout=10)
        print(f"   📡 Inspection creation responds: {response.status_code}")
        if response.status_code == 401:
            print("   ℹ️  401 Unauthorized is expected without auth token")
        elif response.status_code == 422:
            print(f"   ⚠️  422 Validation Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Inspection creation failed: {e}")

def check_frontend_api_config():
    """Check frontend API configuration."""
    print("\n🔍 Checking Frontend API Configuration")
    print("=" * 50)
    
    # Check if frontend is pointing to correct backend
    print("Frontend should be using:")
    print("   VITE_API_URL=https://web-production-6e2c.up.railway.app")
    print("\nIf you're getting network errors, check:")
    print("   1. Backend is running on Railway")
    print("   2. Frontend VITE_API_URL is correct")
    print("   3. CORS is configured for inspect-iq.app")
    print("   4. No firewall blocking requests")

def main():
    print("🚀 InspectIQ Inspection Debug Tool")
    print("=" * 50)
    
    test_inspection_api()
    check_frontend_api_config()
    
    print("\n" + "=" * 50)
    print("💡 Common Network Error Causes:")
    print("   1. Backend server is down")
    print("   2. Wrong API URL in frontend")
    print("   3. CORS configuration issues")
    print("   4. Database connection problems")
    print("   5. Schema validation errors")
    print("\n🔧 Next Steps:")
    print("   1. Check Railway backend logs")
    print("   2. Verify environment variables")
    print("   3. Test API endpoints manually")
    print("   4. Check browser network tab for errors")

if __name__ == "__main__":
    main()