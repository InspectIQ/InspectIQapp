from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.routes import router as workflow_router
from backend.api.auth_routes import router as auth_router
from backend.api.property_routes import router as property_router
from backend.api.inspection_routes import router as inspection_router
from backend.api.file_routes import router as file_router
from backend.api.admin_routes import router as admin_router
from backend.api.setup_routes import router as setup_router
from backend.database.database import init_db
from config.settings import get_settings
from pathlib import Path

# Initialize settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="InspectIQ",
    description="AI-powered home inspection and maintenance diagnosis",
    version="2.0.0"
)

# CORS middleware - parse comma-separated origins
cors_origins = [origin.strip() for origin in settings.cors_origins.split(",")]
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
    init_db()
    # Run database migrations
    try:
        from backend.database.migrate import migrate_database
        migrate_database()
    except Exception as e:
        print(f"Migration warning: {e}")

# Include routes
app.include_router(auth_router, prefix="/api/v1")
app.include_router(property_router, prefix="/api/v1")
app.include_router(inspection_router, prefix="/api/v1")
app.include_router(file_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(setup_router, prefix="/api/v1")  # Temporary - remove after first admin
app.include_router(workflow_router)  # Legacy workflow routes


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "InspectIQ",
        "version": "2.0.4",
        "status": "running",
        "features": ["auth", "properties", "inspections", "ai-analysis", "file-upload", "pdf-export", "password-reset"]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
