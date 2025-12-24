"""
Minimal FastAPI backend for Railway deployment troubleshooting
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create minimal FastAPI app
app = FastAPI(title="InspectIQ Minimal", version="1.0.0")

# Basic CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporary - allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - minimal response"""
    return {
        "service": "InspectIQ Minimal",
        "status": "running",
        "message": "Emergency backend is online",
        "port": os.environ.get("PORT", "unknown")
    }

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy", "backend": "minimal"}

@app.get("/api/v1/health")
async def api_health():
    """API health check"""
    return {"status": "healthy", "api": "minimal"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)