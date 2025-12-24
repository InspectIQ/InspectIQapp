#!/usr/bin/env python3
"""
Debug script to check property database issues and run migration if needed.
Run this on the server to diagnose the properties not showing issue.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database.database import engine, get_db
from backend.database.models import Property, User
from backend.database.migrate import migrate_database
from sqlalchemy import text, inspect
from sqlalchemy.orm import Session

def check_database_schema():
    """Check if the new columns exist in the database."""
    print("🔍 Checking database schema...")
    
    inspector = inspect(engine)
    columns = inspector.get_columns('properties')
    column_names = [col['name'] for col in columns]
    
    print(f"📋 Current property table columns: {column_names}")
    
    required_columns = ['bedrooms', 'bathrooms', 'lot_size']
    missing_columns = [col for col in required_columns if col not in column_names]
    
    if missing_columns:
        print(f"❌ Missing columns: {missing_columns}")
        return False
    else:
        print("✅ All required columns exist")
        return True

def check_properties_data():
    """Check if properties can be loaded from database."""
    print("\n🔍 Checking properties data...")
    
    try:
        db = next(get_db())
        properties = db.query(Property).all()
        print(f"📊 Found {len(properties)} properties in database")
        
        if properties:
            prop = properties[0]
            print(f"📝 Sample property: {prop.address_line1}, {prop.city}")
            print(f"   - bedrooms: {getattr(prop, 'bedrooms', 'MISSING')}")
            print(f"   - bathrooms: {getattr(prop, 'bathrooms', 'MISSING')}")
            print(f"   - lot_size: {getattr(prop, 'lot_size', 'MISSING')}")
        
        return True
    except Exception as e:
        print(f"❌ Error loading properties: {e}")
        return False

def run_migration():
    """Run the database migration."""
    print("\n🔧 Running database migration...")
    try:
        migrate_database()
        print("✅ Migration completed successfully")
        return True
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

def test_api_serialization():
    """Test if properties can be serialized to JSON (like the API does)."""
    print("\n🔍 Testing API serialization...")
    
    try:
        from backend.schemas.property import PropertyResponse
        
        db = next(get_db())
        properties = db.query(Property).limit(1).all()
        
        if properties:
            prop = properties[0]
            # Try to serialize like the API does
            prop_dict = PropertyResponse.model_validate(prop).model_dump()
            print(f"✅ Serialization successful: {prop_dict.get('address_line1', 'Unknown')}")
            return True
        else:
            print("⚠️  No properties to test serialization")
            return True
    except Exception as e:
        print(f"❌ Serialization failed: {e}")
        return False

def main():
    print("🚀 InspectIQ Property Database Diagnostic Tool")
    print("=" * 50)
    
    # Step 1: Check schema
    schema_ok = check_database_schema()
    
    # Step 2: Run migration if needed
    if not schema_ok:
        print("\n🔧 Schema issues detected. Running migration...")
        migration_ok = run_migration()
        if migration_ok:
            schema_ok = check_database_schema()
    
    # Step 3: Check data
    data_ok = check_properties_data()
    
    # Step 4: Test serialization
    serialization_ok = test_api_serialization()
    
    print("\n" + "=" * 50)
    print("📊 DIAGNOSTIC SUMMARY:")
    print(f"   Schema: {'✅ OK' if schema_ok else '❌ FAILED'}")
    print(f"   Data: {'✅ OK' if data_ok else '❌ FAILED'}")
    print(f"   Serialization: {'✅ OK' if serialization_ok else '❌ FAILED'}")
    
    if schema_ok and data_ok and serialization_ok:
        print("\n🎉 All checks passed! Properties should be visible now.")
    else:
        print("\n⚠️  Issues detected. Check the output above for details.")
        print("💡 Try restarting the backend server after running this script.")

if __name__ == "__main__":
    main()