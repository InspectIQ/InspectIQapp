from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.api.auth_routes import router as auth_router
from backend.api.property_routes import router as property_router
from backend.api.inspection_routes import router as inspection_router
from backend.api.file_routes import router as file_router
from backend.api.admin_routes import router as admin_router
from backend.api.setup_routes import router as setup_router
from backend.database.database import init_db
from config.settings import get_settings
from pathlib import Path
import os

# Initialize settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="InspectIQ",
    description="AI-powered home inspection and maintenance diagnosis",
    version="2.0.0"
)

# CORS middleware - handle production domains explicitly
import os
cors_origins_env = os.environ.get("CORS_ORIGINS", settings.cors_origins)
print(f"🔧 CORS_ORIGINS from env: {cors_origins_env}")

# Parse comma-separated origins and add production domains
cors_origins = [origin.strip() for origin in cors_origins_env.split(",")]

# Ensure production domains are always included
production_domains = [
    "https://www.inspect-iq.app",
    "https://inspect-iq.app",
    "http://localhost:3000"
]

for domain in production_domains:
    if domain not in cors_origins:
        cors_origins.append(domain)

print(f"🌐 Final CORS origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
Path(settings.upload_dir).mkdir(exist_ok=True)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup."""
    print("🚀 Starting InspectIQ backend...")
    
    # Initialize database
    print("📊 Initializing database...")
    init_db()
    
    # Run database migrations
    print("🔧 Running database migrations...")
    try:
        from backend.database.migrate import migrate_database
        migrate_database()
        print("✅ Database migration completed successfully")
    except Exception as e:
        print(f"⚠️  Migration warning: {e}")
        print("🔄 Attempting alternative migration...")
        
        # Try alternative migration approach
        try:
            from backend.database.database import engine
            from sqlalchemy import text
            
            with engine.connect() as conn:
                # Add missing columns if they don't exist
                try:
                    conn.execute(text("ALTER TABLE properties ADD COLUMN bedrooms INTEGER"))
                    print("✅ Added bedrooms column")
                except:
                    print("ℹ️  bedrooms column already exists")
                
                try:
                    conn.execute(text("ALTER TABLE properties ADD COLUMN bathrooms INTEGER"))
                    print("✅ Added bathrooms column")
                except:
                    print("ℹ️  bathrooms column already exists")
                
                try:
                    conn.execute(text("ALTER TABLE properties ADD COLUMN lot_size REAL"))
                    print("✅ Added lot_size column")
                except:
                    print("ℹ️  lot_size column already exists")
                
                conn.commit()
                print("✅ Alternative migration completed")
                
        except Exception as alt_e:
            print(f"❌ Alternative migration also failed: {alt_e}")
    
    print("🎉 Backend startup completed!")

# Include routes
app.include_router(auth_router, prefix="/api/v1")
app.include_router(property_router, prefix="/api/v1")
app.include_router(inspection_router, prefix="/api/v1")
app.include_router(file_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(setup_router, prefix="/api/v1")  # Temporary - remove after first admin

# Add legacy workflow routes if available
try:
    from api.routes import router as workflow_router
    app.include_router(workflow_router)  # Legacy workflow routes
    print("✅ Legacy workflow routes loaded")
except ImportError as e:
    print(f"⚠️  Legacy workflow routes not available: {e}")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "InspectIQ",
        "version": "2.0.4",
        "status": "running",
        "features": ["auth", "properties", "inspections", "ai-analysis", "file-upload", "pdf-export", "password-reset"],
        "environment": os.environ.get("RAILWAY_ENVIRONMENT", "unknown")
    }


@app.get("/cors-debug")
async def cors_debug():
    """Debug CORS configuration."""
    cors_origins_env = os.environ.get("CORS_ORIGINS", "not_set")
    frontend_url_env = os.environ.get("FRONTEND_URL", "not_set")
    
    return {
        "cors_origins_env": cors_origins_env,
        "frontend_url_env": frontend_url_env,
        "settings_cors_origins": settings.cors_origins,
        "settings_frontend_url": settings.frontend_url,
        "all_env_vars": {k: v for k, v in os.environ.items() if "CORS" in k or "FRONTEND" in k}
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for Railway."""
    return {
        "status": "healthy",
        "service": "InspectIQ",
        "version": "2.0.4"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

