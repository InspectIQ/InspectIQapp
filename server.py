#!/usr/bin/env python3
"""
Minimal FastAPI server for Render deployment
No dependencies on config or backend modules
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI(
    title="InspectIQ API",
    description="Property inspection backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "InspectIQ Backend",
        "status": "online",
        "version": "1.0.0",
        "message": "Backend is running successfully"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "inspectiq-backend"
    }

@app.get("/api/v1/health")
async def api_health():
    """API health check"""
    return {
        "status": "healthy",
        "api_version": "v1",
        "message": "API is operational"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)