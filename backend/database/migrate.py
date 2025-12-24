"""
Database migration utilities for handling schema updates
"""
from sqlalchemy import text
from backend.database.database import engine
from backend.database.models import Base
import logging

logger = logging.getLogger(__name__)

def migrate_database():
    """Run database migrations and create tables if they don't exist"""
    try:
        # Create all tables (this is safe - won't overwrite existing tables)
        Base.metadata.create_all(bind=engine)
        
        # Add new columns if they don't exist
        with engine.connect() as conn:
            # Check if reset_token_hash column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='reset_token_hash'
            """))
            
            if not result.fetchone():
                logger.info("Adding reset_token_hash column to users table")
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_hash VARCHAR"))
                conn.commit()
            
            # Check if reset_token_expires column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='reset_token_expires'
            """))
            
            if not result.fetchone():
                logger.info("Adding reset_token_expires column to users table")
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP"))
                conn.commit()
            
            # Add new property columns
            property_columns = [
                ('bedrooms', 'INTEGER'),
                ('bathrooms', 'INTEGER'), 
                ('lot_size', 'FLOAT')
            ]
            
            for column_name, column_type in property_columns:
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='properties' AND column_name='{column_name}'
                """))
                
                if not result.fetchone():
                    logger.info(f"Adding {column_name} column to properties table")
                    conn.execute(text(f"ALTER TABLE properties ADD COLUMN {column_name} {column_type}"))
                    conn.commit()
                
        logger.info("Database migration completed successfully")
        
    except Exception as e:
        logger.error(f"Database migration failed: {e}")
        # For SQLite (development), use different syntax
        try:
            with engine.connect() as conn:
                # User table migrations
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_hash TEXT"))
                except:
                    pass  # Column might already exist
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME"))
                except:
                    pass  # Column might already exist
                
                # Property table migrations
                try:
                    conn.execute(text("ALTER TABLE properties ADD COLUMN bedrooms INTEGER"))
                except:
                    pass  # Column might already exist
                try:
                    conn.execute(text("ALTER TABLE properties ADD COLUMN bathrooms INTEGER"))
                except:
                    pass  # Column might already exist
                try:
                    conn.execute(text("ALTER TABLE properties ADD COLUMN lot_size REAL"))
                except:
                    pass  # Column might already exist
                    
                conn.commit()
            logger.info("SQLite migration completed")
        except Exception as sqlite_error:
            logger.error(f"SQLite migration also failed: {sqlite_error}")
            # Don't raise - let the app continue even if migration fails

if __name__ == "__main__":
    migrate_database()