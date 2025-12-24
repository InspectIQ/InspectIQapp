# Railway Deployment Fix Guide

## Current Issue
Railway backend container failing with: `ERROR (catatonit:2): failed to exec pid1: No such file or directory`

## Root Cause
This error typically occurs when:
1. The start command is malformed or references non-existent files
2. There are conflicting deployment configurations
3. The Python environment isn't properly set up

## Immediate Fix Steps

### Step 1: Clear Railway Configuration
In your Railway dashboard:

1. Go to your backend service
2. Navigate to **Settings** → **Environment**
3. Delete any custom **Start Command** if set
4. Let Railway use the default from `nixpacks.toml`

### Step 2: Verify Environment Variables
Ensure these are set in Railway:

```bash
DATABASE_URL=postgresql://postgres:password@host:port/database
OPENAI_API_KEY=your_openai_key
SECRET_KEY=your_secret_key
CORS_ORIGINS=https://inspect-iq.app,https://www.inspect-iq.app,http://localhost:3000
FRONTEND_URL=https://inspect-iq.app
```

### Step 3: Force Redeploy
1. Go to **Deployments** tab
2. Click **Deploy** → **Redeploy**
3. Monitor the build logs

### Step 4: Alternative Fix (If Step 3 Fails)
If the redeploy still fails, try this manual start command in Railway Settings:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Expected Build Process

### Successful Build Logs Should Show:
```
✅ Installing Python 3.11
✅ Installing dependencies from requirements.txt
✅ Starting uvicorn server
✅ Application running on port $PORT
```

### Failed Build Will Show:
```
❌ ERROR (catatonit:2): failed to exec pid1: No such file or directory
```

## Testing After Fix

### 1. Check Backend Health
Visit: `https://web-production-6e2c.up.railway.app/`

Expected response:
```json
{
  "service": "InspectIQ",
  "version": "2.0.4",
  "status": "running"
}
```

### 2. Test API Endpoint
```bash
curl https://web-production-6e2c.up.railway.app/api/v1/health
```

### 3. Check CORS
Open browser console on `https://inspect-iq.app` and run:
```javascript
fetch('https://web-production-6e2c.up.railway.app/')
  .then(r => r.json())
  .then(data => console.log('✅ CORS working:', data))
  .catch(e => console.error('❌ CORS error:', e))
```

## Files Updated for This Fix

- `railway.json` - Simplified configuration
- `nixpacks.toml` - Basic start command
- Removed `start.py` - Eliminated custom startup script
- Removed `Procfile` - Using nixpacks only

## If Problem Persists

### Option 1: Manual Railway Settings
1. Go to Railway Settings → General
2. Set **Root Directory**: `.` (current directory)
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option 2: Check Railway Service Logs
1. Go to Railway dashboard
2. Click on your backend service
3. Check **Logs** tab for detailed error messages
4. Look for Python import errors or missing dependencies

### Option 3: Restart Railway Service
1. Go to Settings → General
2. Click **Restart Service**
3. Monitor deployment logs

## Next Steps After Backend is Running

1. **Test Login**: Try logging into `https://inspect-iq.app`
2. **Run Migration**: Visit `/api/v1/setup/migrate` to update database
3. **Test Property Creation**: Create a new property with address lookup
4. **Test Inspection**: Create and analyze an inspection
5. **Verify Dashboard**: Check that property/inspection counts display correctly

## Emergency Rollback

If all else fails, you can temporarily use a simpler main.py:

```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "minimal backend running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

This will at least get the backend online so you can troubleshoot further.