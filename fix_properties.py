#!/usr/bin/env python3
"""
Quick fix script for properties not showing issue.
This will run the database migration and restart the backend.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def main():
    print("🔧 InspectIQ Property Fix Script")
    print("=" * 40)
    
    # Run migration
    print("1. Running database migration...")
    try:
        from backend.database.migrate import migrate_database
        migrate_database()
        print("   ✅ Migration completed")
    except Exception as e:
        print(f"   ❌ Migration failed: {e}")
        return
    
    # Test database connection
    print("2. Testing database connection...")
    try:
        from backend.database.database import get_db
        from backend.database.models import Property
        
        db = next(get_db())
        count = db.query(Property).count()
        print(f"   ✅ Found {count} properties in database")
    except Exception as e:
        print(f"   ❌ Database test failed: {e}")
        return
    
    print("\n🎉 Fix completed! Please restart your backend server.")
    print("💡 If using Railway, the server should restart automatically.")

if __name__ == "__main__":
    main()