# Railway Manual Configuration Fix

## The Problem
Railway container keeps failing with "failed to exec pid1: No such file or directory" - this is a Railway platform issue, not a code issue.

## Manual Fix Steps

### Step 1: Clear All Railway Configuration
✅ **DONE** - Removed all config files:
- Deleted `railway.json`
- Deleted `nixpacks.toml` 
- Deleted minimal files
- Created simple `Procfile`

### Step 2: Manual Railway Settings
Go to your Railway backend service dashboard:

1. **Settings → General**
   - **Root Directory:** `.` (just a dot)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`

2. **Settings → Environment Variables**
   Make sure these are set:
   ```
   DATABASE_URL=your_postgresql_url
   OPENAI_API_KEY=your_openai_key
   SECRET_KEY=your_secret_key
   CORS_ORIGINS=https://inspect-iq.app,https://www.inspect-iq.app,http://localhost:3000
   FRONTEND_URL=https://inspect-iq.app
   PORT=8000
   ```

### Step 3: Force Redeploy
1. Go to **Deployments** tab
2. Click **"Deploy"** → **"Redeploy"**
3. Watch the logs carefully

### Step 4: If Still Failing - Alternative Deployment
If Railway continues to fail, we have backup options:

#### Option A: Render.com (Recommended)
1. Connect your GitHub repo to Render
2. Create new Web Service
3. Use these settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`
   - **Environment:** Python 3.11

#### Option B: Heroku
1. Create new Heroku app
2. Connect GitHub repo
3. Add Python buildpack
4. Deploy

#### Option C: DigitalOcean App Platform
1. Create new app from GitHub
2. Select Python
3. Use auto-detected settings

## Test Commands After Deployment

### Test 1: Basic Health Check
```bash
curl https://your-backend-url.railway.app/
```
Expected: `{"Hello": "World", "Port": "8000"}`

### Test 2: Health Endpoint
```bash
curl https://your-backend-url.railway.app/health
```
Expected: `{"status": "ok"}`

### Test 3: Frontend Connection
Open browser console on `https://inspect-iq.app`:
```javascript
fetch('https://your-backend-url.railway.app/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(e => console.error('❌ Backend failed:', e))
```

## Current Files Status

### Working Files:
- `app.py` - Ultra-simple FastAPI app that should work
- `Procfile` - Simple web process definition
- `requirements.txt` - Full dependencies (will be used after basic app works)

### Next Steps After Basic App Works:
1. Test that `app.py` deploys successfully
2. Gradually replace with full `main.py` functionality
3. Add back database connections
4. Test all UX improvements

## Railway Logs to Watch For

### ✅ Success Indicators:
```
Building...
Installing dependencies...
Starting web process...
App is running on port 8000
```

### ❌ Failure Indicators:
```
ERROR (catatonit:2): failed to exec pid1
Container failed to start
Build failed
```

## Emergency Contacts
If Railway continues to fail:
1. Railway Support: help@railway.app
2. Check Railway Status: status.railway.app
3. Railway Discord: discord.gg/railway

## Commit These Changes
```bash
git add .
git commit -m "Railway manual fix: remove all config files, use simple Procfile

- Deleted railway.json, nixpacks.toml (causing container issues)
- Created simple app.py and Procfile
- Manual Railway settings required (see RAILWAY_MANUAL_FIX.md)
- This should resolve persistent container startup failures"
git push
```

After committing, manually configure Railway settings as described above.