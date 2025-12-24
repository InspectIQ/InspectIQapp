# Network Error Fix Guide

## Problem
Users experiencing "Network Error" when creating inspections and running analysis.

## Root Causes Identified

### 1. CORS Configuration Issue ⚠️ **CRITICAL**
The backend CORS settings don't include the new domain `https://inspect-iq.app`.

**Current CORS setting:**
```
CORS_ORIGINS=http://localhost:3000
```

**Required CORS setting:**
```
CORS_ORIGINS=https://inspect-iq.app,https://www.inspect-iq.app,http://localhost:3000
```

### 2. Schema Validation Issue
The InspectionCreate schema was expecting an enum but receiving a string from the frontend.

**Status:** ✅ **FIXED** - Updated schema to handle string-to-enum conversion.

### 3. Database Migration Issue
New property fields might not exist in the database, causing serialization errors.

**Status:** ✅ **FIXED** - Migration script created and should be run.

## Immediate Fixes Required

### Fix 1: Update Railway Environment Variables
In Railway dashboard, update these environment variables:

```bash
CORS_ORIGINS=https://inspect-iq.app,https://www.inspect-iq.app,http://localhost:3000
FRONTEND_URL=https://inspect-iq.app
```

### Fix 2: Restart Backend Service
After updating environment variables, restart the Railway backend service.

### Fix 3: Verify API Endpoint
Ensure frontend is using the correct API URL:
```
VITE_API_URL=https://web-production-6e2c.up.railway.app
```

## Testing Steps

### 1. Test CORS
Open browser console on `https://inspect-iq.app` and run:
```javascript
fetch('https://web-production-6e2c.up.railway.app/api/v1/properties', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
}).then(r => console.log('CORS OK:', r.status))
```

### 2. Test Inspection Creation
Try creating a new inspection and check browser Network tab for:
- Request URL
- Response status
- Error messages

### 3. Test Backend Health
Visit: `https://web-production-6e2c.up.railway.app/`
Should return JSON with service info.

## Files Updated

### Backend Schema Fix
- `backend/schemas/inspection_extended.py` - Added string-to-enum validation

### Debug Scripts Created
- `debug_inspections.py` - Test inspection API endpoints
- `debug_properties.py` - Test property database issues
- `fix_properties.py` - Run database migration

## Expected Results After Fix

✅ Properties load correctly on dashboard
✅ New property creation works with address lookup
✅ Inspection creation succeeds without network errors
✅ Inspection analysis completes successfully
✅ No CORS errors in browser console

## Verification Commands

### Check Railway Environment Variables
```bash
# In Railway console
echo $CORS_ORIGINS
echo $FRONTEND_URL
```

### Test API Endpoints
```bash
# Run debug script
python debug_inspections.py
```

### Check Backend Logs
Monitor Railway logs for:
- CORS errors
- Database connection issues
- Schema validation errors
- 500 internal server errors

## Common Error Messages and Solutions

### "Network Error"
- **Cause:** CORS misconfiguration
- **Fix:** Update CORS_ORIGINS environment variable

### "Failed to create inspection"
- **Cause:** Schema validation or database issues
- **Fix:** Check backend logs, run migration script

### "TypeError: Cannot read property"
- **Cause:** Missing database columns
- **Fix:** Run `python fix_properties.py`

### "401 Unauthorized"
- **Cause:** Authentication token issues
- **Fix:** Re-login to get fresh token

## Priority Actions

1. **IMMEDIATE:** Update Railway CORS_ORIGINS environment variable
2. **IMMEDIATE:** Restart Railway backend service
3. **VERIFY:** Test inspection creation on live site
4. **MONITOR:** Check Railway logs for any remaining errors

## Contact for Issues

If network errors persist after these fixes:
1. Check Railway backend logs
2. Test API endpoints with debug script
3. Verify environment variables are set correctly
4. Check browser network tab for specific error details