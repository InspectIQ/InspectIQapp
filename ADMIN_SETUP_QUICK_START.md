# 🚀 Admin Console - Quick Start

## ✅ What We Built

A comprehensive admin console with:
- **Dashboard** - Overview statistics and metrics
- **User Management** - View, edit, and manage all users
- **Analytics** - Detailed insights into inspections and properties
- **System Metrics** - Monitor platform health and performance

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Promote Your First Admin

You need to manually promote one user to admin role.

**Option A: Using Railway Database (Recommended)**

1. Go to **Railway Dashboard**
2. Click on your **PostgreSQL** service
3. Click **"Data"** tab
4. Click **"Query"** or open the SQL console
5. Run this query (replace with your email):

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

6. Verify it worked:
```sql
SELECT id, email, name, role FROM users WHERE role = 'admin';
```

**Option B: Using Local Database**

If testing locally:
```bash
psql -d inspectiq -c "UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';"
```

---

### Step 2: Deploy the Changes

**Commit and push the new code:**

```bash
git add .
git commit -m "Add comprehensive admin console with analytics and user management"
git push
```

**Railway will automatically:**
- Deploy the new backend with admin routes
- Update the frontend with admin UI

**Wait 2-3 minutes** for deployment to complete.

---

### Step 3: Access the Admin Console

1. **Go to your live site:** https://inspect-iqapp.vercel.app
2. **Log in** with the account you promoted to admin
3. **Look for "Admin Panel"** link in the top navigation
4. **Click it** to access `/admin`

---

## 🎨 What You'll See

### Dashboard
- 8 key metrics cards
- Quick action buttons
- Real-time statistics

### Users Page
- Searchable user list
- Role management dropdowns
- Status toggle buttons
- Delete user functionality

### Analytics Page
- Inspection timeline chart
- Status breakdown bars
- Property type distribution
- Location analytics

### System Page
- Uptime monitoring
- Response time tracking
- Database health
- Storage usage
- System status indicators

---

## 🔧 Testing the Admin Console

### Test User Management

1. Go to `/admin/users`
2. Search for a user
3. Change their role (user → inspector)
4. Toggle their status (active → inactive)
5. View their details

### Test Analytics

1. Go to `/admin/analytics`
2. Change time range (7/30/90 days)
3. View inspection trends
4. Check property distribution

### Test System Metrics

1. Go to `/admin/system`
2. Click "Refresh" button
3. Monitor real-time metrics
4. Check system status

---

## 📊 API Endpoints Added

```
GET  /api/v1/admin/dashboard
GET  /api/v1/admin/users
GET  /api/v1/admin/users/{id}
PUT  /api/v1/admin/users/{id}/role
PUT  /api/v1/admin/users/{id}/status
DELETE /api/v1/admin/users/{id}
GET  /api/v1/admin/analytics/inspections
GET  /api/v1/admin/analytics/properties
GET  /api/v1/admin/system/metrics
```

---

## 🎯 Files Created

### Backend
- `backend/api/admin_routes.py` - Admin API endpoints
- `backend/schemas/admin.py` - Admin data models
- Updated `backend/auth/auth.py` - Added `require_admin` function
- Updated `main.py` - Registered admin routes

### Frontend
- `frontend/src/pages/admin/AdminDashboard.tsx` - Main dashboard
- `frontend/src/pages/admin/AdminUsers.tsx` - User management
- `frontend/src/pages/admin/AdminAnalytics.tsx` - Analytics page
- `frontend/src/pages/admin/AdminSystem.tsx` - System metrics
- `frontend/src/components/AdminLayout.tsx` - Admin layout wrapper
- Updated `frontend/src/services/api.ts` - Admin API calls
- Updated `frontend/src/App.tsx` - Admin routes
- Updated `frontend/src/components/Layout.tsx` - Admin panel link

### Documentation
- `ADMIN_CONSOLE_GUIDE.md` - Complete admin guide
- `ADMIN_SETUP_QUICK_START.md` - This file

---

## 🔒 Security Features

✅ **Role-based access control**
- Only admins can access `/admin` routes
- Backend validates admin role on every request
- Frontend hides admin links from non-admins

✅ **Protected API endpoints**
- All admin endpoints require authentication
- Admin role check via `require_admin` dependency
- Returns 403 Forbidden for non-admin users

✅ **Safe user operations**
- Confirmation dialogs for destructive actions
- Cannot delete your own admin account
- Cascade delete for user data

---

## 🎉 You're Done!

Your admin console is now live and ready to use!

**Next Steps:**
1. ✅ Promote your first admin user
2. ✅ Deploy the changes
3. ✅ Access the admin console
4. ✅ Explore all features
5. ✅ Manage your platform!

---

## 📱 Quick Reference

**Admin Console URL:** `https://inspect-iqapp.vercel.app/admin`

**Access Requirements:**
- Must be logged in
- Must have `role = 'admin'`

**Navigation:**
- Dashboard: `/admin`
- Users: `/admin/users`
- Analytics: `/admin/analytics`
- System: `/admin/system`

---

## 🆘 Troubleshooting

**Problem:** "Access Denied" message
**Solution:** Run the SQL query to promote your user to admin

**Problem:** Admin Panel link not visible
**Solution:** Log out and log back in after promoting to admin

**Problem:** 403 Forbidden errors
**Solution:** Verify your user role in the database

**Problem:** Metrics not loading
**Solution:** Check Railway deployment logs for errors

---

## 🎊 Congratulations!

You now have a **full-featured admin console** with:
- ✅ Real-time dashboard
- ✅ User management
- ✅ Advanced analytics
- ✅ System monitoring
- ✅ Role-based access control

**Your platform is now enterprise-ready!** 🚀
