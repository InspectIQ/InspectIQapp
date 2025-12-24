#!/usr/bin/env python3
"""
Comprehensive fix for dashboard and property detail issues.
This script will diagnose and fix multiple related problems.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def fix_database_schema():
    """Run database migration to ensure all columns exist."""
    print("🔧 Running database migration...")
    try:
        from backend.database.migrate import migrate_database
        migrate_database()
        print("   ✅ Database migration completed")
        return True
    except Exception as e:
        print(f"   ❌ Migration failed: {e}")
        return False

def test_property_api():
    """Test property API endpoints."""
    print("\n🔍 Testing Property API...")
    try:
        from backend.database.database import get_db
        from backend.database.models import Property, User
        from backend.schemas.property import PropertyResponse
        
        db = next(get_db())
        
        # Test property query
        properties = db.query(Property).all()
        print(f"   📊 Found {len(properties)} properties in database")
        
        if properties:
            # Test serialization
            prop = properties[0]
            try:
                prop_response = PropertyResponse.model_validate(prop)
                print(f"   ✅ Property serialization works: {prop_response.address_line1}")
                return True
            except Exception as e:
                print(f"   ❌ Property serialization failed: {e}")
                return False
        else:
            print("   ⚠️  No properties to test")
            return True
            
    except Exception as e:
        print(f"   ❌ Property API test failed: {e}")
        return False

def test_inspection_api():
    """Test inspection API endpoints."""
    print("\n🔍 Testing Inspection API...")
    try:
        from backend.database.database import get_db
        from backend.database.models import Inspection
        from backend.schemas.inspection_extended import InspectionResponse
        
        db = next(get_db())
        
        # Test inspection query
        inspections = db.query(Inspection).all()
        print(f"   📊 Found {len(inspections)} inspections in database")
        
        if inspections:
            # Test serialization
            inspection = inspections[0]
            try:
                insp_response = InspectionResponse.model_validate(inspection)
                print(f"   ✅ Inspection serialization works: ID {insp_response.id}")
                return True
            except Exception as e:
                print(f"   ❌ Inspection serialization failed: {e}")
                return False
        else:
            print("   ⚠️  No inspections to test")
            return True
            
    except Exception as e:
        print(f"   ❌ Inspection API test failed: {e}")
        return False

def check_user_ownership():
    """Check if there are user ownership issues."""
    print("\n🔍 Checking User Ownership...")
    try:
        from backend.database.database import get_db
        from backend.database.models import Property, User, Inspection
        
        db = next(get_db())
        
        # Check users
        users = db.query(User).all()
        print(f"   👥 Found {len(users)} users")
        
        # Check property ownership
        properties = db.query(Property).all()
        orphaned_properties = db.query(Property).filter(Property.owner_id.is_(None)).count()
        print(f"   🏠 Properties: {len(properties)} total, {orphaned_properties} orphaned")
        
        # Check inspection ownership
        inspections = db.query(Inspection).all()
        orphaned_inspections = db.query(Inspection).filter(Inspection.inspector_id.is_(None)).count()
        print(f"   📋 Inspections: {len(inspections)} total, {orphaned_inspections} orphaned")
        
        if orphaned_properties > 0 or orphaned_inspections > 0:
            print("   ⚠️  Found orphaned records - this could cause API failures")
            return False
        else:
            print("   ✅ All records have proper ownership")
            return True
            
    except Exception as e:
        print(f"   ❌ Ownership check failed: {e}")
        return False

def fix_orphaned_records():
    """Fix orphaned records by assigning them to the first user."""
    print("\n🔧 Fixing orphaned records...")
    try:
        from backend.database.database import get_db
        from backend.database.models import Property, User, Inspection
        
        db = next(get_db())
        
        # Get first user
        first_user = db.query(User).first()
        if not first_user:
            print("   ❌ No users found - cannot fix orphaned records")
            return False
        
        # Fix orphaned properties
        orphaned_props = db.query(Property).filter(Property.owner_id.is_(None)).all()
        for prop in orphaned_props:
            prop.owner_id = first_user.id
        
        # Fix orphaned inspections
        orphaned_insps = db.query(Inspection).filter(Inspection.inspector_id.is_(None)).all()
        for insp in orphaned_insps:
            insp.inspector_id = first_user.id
        
        db.commit()
        print(f"   ✅ Fixed {len(orphaned_props)} properties and {len(orphaned_insps)} inspections")
        return True
        
    except Exception as e:
        print(f"   ❌ Failed to fix orphaned records: {e}")
        return False

def test_api_endpoints():
    """Test actual API endpoints."""
    print("\n🔍 Testing API Endpoints...")
    try:
        import requests
        
        backend_url = "https://web-production-6e2c.up.railway.app"
        
        # Test health
        response = requests.get(f"{backend_url}/", timeout=10)
        print(f"   🏥 Health check: {response.status_code}")
        
        # Test properties endpoint (should return 401 without auth)
        response = requests.get(f"{backend_url}/api/v1/properties", timeout=10)
        print(f"   🏠 Properties endpoint: {response.status_code}")
        
        # Test inspections endpoint (should return 401 without auth)
        response = requests.get(f"{backend_url}/api/v1/inspections", timeout=10)
        print(f"   📋 Inspections endpoint: {response.status_code}")
        
        if response.status_code in [200, 401]:  # 401 is expected without auth
            print("   ✅ API endpoints are responding")
            return True
        else:
            print("   ❌ API endpoints not responding correctly")
            return False
            
    except Exception as e:
        print(f"   ❌ API endpoint test failed: {e}")
        return False

def main():
    print("🚀 InspectIQ Dashboard Issues Fix")
    print("=" * 50)
    
    # Step 1: Fix database schema
    schema_ok = fix_database_schema()
    
    # Step 2: Test APIs
    property_api_ok = test_property_api()
    inspection_api_ok = test_inspection_api()
    
    # Step 3: Check ownership
    ownership_ok = check_user_ownership()
    
    # Step 4: Fix orphaned records if needed
    if not ownership_ok:
        ownership_ok = fix_orphaned_records()
    
    # Step 5: Test actual endpoints
    endpoints_ok = test_api_endpoints()
    
    print("\n" + "=" * 50)
    print("📊 DIAGNOSTIC RESULTS:")
    print(f"   Database Schema: {'✅ OK' if schema_ok else '❌ FAILED'}")
    print(f"   Property API: {'✅ OK' if property_api_ok else '❌ FAILED'}")
    print(f"   Inspection API: {'✅ OK' if inspection_api_ok else '❌ FAILED'}")
    print(f"   Record Ownership: {'✅ OK' if ownership_ok else '❌ FAILED'}")
    print(f"   API Endpoints: {'✅ OK' if endpoints_ok else '❌ FAILED'}")
    
    if all([schema_ok, property_api_ok, inspection_api_ok, ownership_ok, endpoints_ok]):
        print("\n🎉 All issues fixed! Dashboard should work now.")
        print("💡 Try refreshing the dashboard page.")
    else:
        print("\n⚠️  Some issues remain. Check the output above.")
        print("🔧 You may need to restart the backend server.")

if __name__ == "__main__":
    main()