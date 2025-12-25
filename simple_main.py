"""
Ultra-simple FastAPI backend for Railway
"""
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create app
app = FastAPI(title="InspectIQ Backend", version="1.0.0")

# CORS - allow all for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "InspectIQ Backend",
        "status": "running",
        "version": "1.0.0",
        "port": os.environ.get("PORT", "8000")
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/api/v1/health")
def api_health():
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)