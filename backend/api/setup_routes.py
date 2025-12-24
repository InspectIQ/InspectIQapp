from fastapi import APIRouter, HTTPException
from backend.database.migrate import migrate_database
from backend.database.database import engine
from sqlalchemy import text, inspect

router = APIRouter(prefix="/setup", tags=["setup"])

@router.post("/migrate")
async def run_migration():
    """Run database migration manually - REMOVE AFTER FIRST USE"""
    try:
        print("🔧 Running manual database migration...")
        migrate_database()
        
        # Verify columns exist
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('properties')]
        
        return {
            "success": True,
            "message": "Migration completed successfully",
            "columns": columns,
            "has_bedrooms": "bedrooms" in columns,
            "has_bathrooms": "bathrooms" in columns,
            "has_lot_size": "lot_size" in columns
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Migration failed: {str(e)}",
            "error": str(e)
        }

@router.get("/check-columns")
async def check_database_columns():
    """Check if the new columns exist in the database"""
    try:
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('properties')]
        
        return {
            "columns": columns,
            "has_bedrooms": "bedrooms" in columns,
            "has_bathrooms": "bathrooms" in columns,
            "has_lot_size": "lot_size" in columns,
            "missing_columns": [col for col in ["bedrooms", "bathrooms", "lot_size"] if col not in columns]
        }
    except Exception as e:
        return {
            "error": str(e)
        }

@router.post("/force-add-columns")
async def force_add_columns():
    """Force add missing columns - EMERGENCY USE ONLY"""
    try:
        results = []
        
        with engine.connect() as conn:
            # Try to add each column
            for column_name, column_type in [
                ("bedrooms", "INTEGER"),
                ("bathrooms", "INTEGER"), 
                ("lot_size", "REAL")
            ]:
                try:
                    conn.execute(text(f"ALTER TABLE properties ADD COLUMN {column_name} {column_type}"))
                    results.append(f"✅ Added {column_name} column")
                except Exception as e:
                    if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                        results.append(f"ℹ️  {column_name} column already exists")
                    else:
                        results.append(f"❌ Failed to add {column_name}: {str(e)}")
            
            conn.commit()
        
        return {
            "success": True,
            "results": results
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }