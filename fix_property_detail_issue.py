#!/usr/bin/env python3
"""
Specific fix for "Property not found" issue when clicking on properties.
This targets the individual property GET endpoint failure.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_individual_property_retrieval():
    """Test retrieving individual properties to identify the exact issue."""
    print("🔍 Testing Individual Property Retrieval")
    print("=" * 50)
    
    try:
        from backend.database.database import get_db
        from backend.database.models import Property
        from backend.schemas.property import PropertyResponse
        from sqlalchemy import inspect
        
        db = next(get_db())
        
        # Get all properties
        properties = db.query(Property).all()
        print(f"📊 Found {len(properties)} properties in database")
        
        if not properties:
            print("❌ No properties found - cannot test individual retrieval")
            return False
        
        # Test each property individually
        for i, prop in enumerate(properties[:3]):  # Test first 3 properties
            print(f"\n🔍 Testing Property {i+1} (ID: {prop.id})")
            
            try:
                # Check if property has all required attributes
                print(f"   📍 Address: {prop.address_line1}")
                print(f"   🏠 Type: {getattr(prop, 'property_type', 'MISSING')}")
                print(f"   🛏️  Bedrooms: {getattr(prop, 'bedrooms', 'MISSING')}")
                print(f"   🚿 Bathrooms: {getattr(prop, 'bathrooms', 'MISSING')}")
                print(f"   📐 Lot Size: {getattr(prop, 'lot_size', 'MISSING')}")
                
                # Try to serialize with PropertyResponse
                prop_response = PropertyResponse.model_validate(prop)
                print(f"   ✅ Serialization successful")
                
            except Exception as e:
                print(f"   ❌ Property {prop.id} serialization failed: {e}")
                return False
        
        print(f"\n✅ All tested properties can be serialized successfully")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def check_database_columns():
    """Check if the new columns actually exist in the database."""
    print("\n🔍 Checking Database Columns")
    print("=" * 30)
    
    try:
        from backend.database.database import engine
        from sqlalchemy import inspect
        
        inspector = inspect(engine)
        columns = inspector.get_columns('properties')
        column_names = [col['name'] for col in columns]
        
        print(f"📋 Current columns: {column_names}")
        
        required_new_columns = ['bedrooms', 'bathrooms', 'lot_size']
        missing_columns = [col for col in required_new_columns if col not in column_names]
        
        if missing_columns:
            print(f"❌ Missing columns: {missing_columns}")
            print("💡 This is likely the cause of the 'Property not found' error")
            return False
        else:
            print("✅ All required columns exist")
            return True
            
    except Exception as e:
        print(f"❌ Column check failed: {e}")
        return False

def test_property_api_endpoint():
    """Test the actual property API endpoint."""
    print("\n🔍 Testing Property API Endpoint")
    print("=" * 35)
    
    try:
        from backend.database.database import get_db
        from backend.database.models import Property, User
        from backend.api.property_routes import get_property
        from backend.auth.auth import get_current_active_user
        
        db = next(get_db())
        
        # Get first property and user
        property = db.query(Property).first()
        user = db.query(User).first()
        
        if not property or not user:
            print("❌ No property or user found for testing")
            return False
        
        print(f"🧪 Testing property ID {property.id} for user {user.email}")
        
        # Simulate the API call
        try:
            # This simulates what happens when the API endpoint is called
            result = db.query(Property).filter(
                Property.id == property.id,
                Property.owner_id == user.id
            ).first()
            
            if not result:
                print("❌ Property not found (ownership issue)")
                return False
            
            # Try to serialize the result
            from backend.schemas.property import PropertyResponse
            response = PropertyResponse.model_validate(result)
            print("✅ API endpoint simulation successful")
            return True
            
        except Exception as e:
            print(f"❌ API endpoint simulation failed: {e}")
            return False
            
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def fix_missing_columns():
    """Add missing columns to the database."""
    print("\n🔧 Adding Missing Database Columns")
    print("=" * 40)
    
    try:
        from backend.database.migrate import migrate_database
        migrate_database()
        print("✅ Database migration completed")
        return True
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

def main():
    print("🚀 Property Detail Issue Diagnostic & Fix")
    print("=" * 50)
    
    # Step 1: Check database columns
    columns_ok = check_database_columns()
    
    # Step 2: Fix missing columns if needed
    if not columns_ok:
        print("\n🔧 Attempting to fix missing columns...")
        columns_ok = fix_missing_columns()
        if columns_ok:
            columns_ok = check_database_columns()  # Verify fix
    
    # Step 3: Test individual property retrieval
    if columns_ok:
        retrieval_ok = test_individual_property_retrieval()
    else:
        retrieval_ok = False
    
    # Step 4: Test API endpoint
    if retrieval_ok:
        api_ok = test_property_api_endpoint()
    else:
        api_ok = False
    
    print("\n" + "=" * 50)
    print("📊 DIAGNOSTIC RESULTS:")
    print(f"   Database Columns: {'✅ OK' if columns_ok else '❌ MISSING'}")
    print(f"   Property Retrieval: {'✅ OK' if retrieval_ok else '❌ FAILED'}")
    print(f"   API Endpoint: {'✅ OK' if api_ok else '❌ FAILED'}")
    
    if columns_ok and retrieval_ok and api_ok:
        print("\n🎉 Property detail issue should be fixed!")
        print("💡 Try clicking on a property now - it should work.")
    else:
        print("\n⚠️  Issues remain:")
        if not columns_ok:
            print("   - Database columns are missing")
        if not retrieval_ok:
            print("   - Property serialization is failing")
        if not api_ok:
            print("   - API endpoint has issues")
        
        print("\n🔧 Next steps:")
        print("   1. Restart the backend server")
        print("   2. Check Railway logs for errors")
        print("   3. Verify database migration ran successfully")

if __name__ == "__main__":
    main()