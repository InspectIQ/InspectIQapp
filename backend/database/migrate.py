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
                
        logger.info("Database migration completed successfully")
        
    except Exception as e:
        logger.error(f"Database migration failed: {e}")
        # For SQLite (development), use different syntax
        try:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_hash TEXT"))
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME"))
                conn.commit()
            logger.info("SQLite migration completed")
        except Exception as sqlite_error:
            logger.error(f"SQLite migration also failed: {sqlite_error}")
            raise

if __name__ == "__main__":
    migrate_database()