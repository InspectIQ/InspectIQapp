# 🎛️ Admin Console Guide

## Overview

The InspectIQ Admin Console provides comprehensive tools for managing your platform, monitoring performance, and analyzing user behavior.

---

## 🔐 Access Requirements

**To access the admin console:**
1. Your user account must have the `admin` role
2. Navigate to `/admin` or click "Admin Panel" in the top navigation (visible only to admins)

**Default Admin Setup:**
- The first user registered can be manually promoted to admin via database
- Or use the API to update a user's role to "admin"

---

## 📊 Features

### 1. Dashboard (`/admin`)

**Overview Statistics:**
- Total users and active users (last 30 days)
- Total properties and inspections
- Completed vs pending inspections
- Total photos uploaded
- New users and inspections this week
- Average inspections per user

**Quick Actions:**
- Manage Users
- View Analytics
- Monitor System

**Use Cases:**
- Get a quick snapshot of platform health
- Monitor growth trends
- Identify usage patterns

---

### 2. User Management (`/admin/users`)

**Features:**
- View all users with search and filtering
- Search by name or email
- Filter by role (user, inspector, admin)
- View user statistics (properties, inspections)
- Change user roles
- Activate/deactivate accounts
- Delete users (with confirmation)

**User Information Displayed:**
- Name and email
- Current role
- Account status (active/inactive)
- Number of properties
- Number of inspections
- Join date

**Actions:**
- **Change Role:** Dropdown to switch between user, inspector, admin
- **Toggle Status:** Click status badge to activate/deactivate
- **Delete User:** Removes user and all associated data (properties, inspections, photos)

**Best Practices:**
- Regularly review inactive accounts
- Promote trusted users to inspector role
- Be cautious with delete operations (irreversible)

---

### 3. Analytics (`/admin/analytics`)

**Inspection Analytics:**
- Total inspections in selected time period
- Inspections over time (daily chart)
- Status breakdown (pending, in-progress, completed)
- Average completion time
- Completion rate percentage

**Property Analytics:**
- Total properties
- Properties by type (house, apartment, condo, etc.)
- Properties by location (top 10 states/regions)
- Average property age

**Time Range Options:**
- Last 7 days
- Last 30 days
- Last 90 days

**Use Cases:**
- Identify peak usage times
- Track completion rates
- Understand geographic distribution
- Monitor platform growth

---

### 4. System Metrics (`/admin/system`)

**Performance Monitoring:**
- **Uptime:** Platform availability percentage
- **Response Time:** Average API response time
- **API Calls:** Total API calls today
- **Database Records:** Total records across all tables
- **Storage Used:** Total file storage in MB/GB

**Database Health:**
- Connection pool status
- Query performance
- Total records

**Storage Metrics:**
- Used storage vs limit
- Number of photos
- Average photo size

**System Status:**
- API Server status
- Database status
- File Storage status
- AI Services status

**Auto-Refresh:**
- Metrics refresh every 30 seconds
- Manual refresh button available

---

## 🔧 API Endpoints

### Dashboard
```
GET /api/v1/admin/dashboard
```
Returns overview statistics

### Users
```
GET /api/v1/admin/users?search=&role=
GET /api/v1/admin/users/{user_id}
PUT /api/v1/admin/users/{user_id}/role?role=admin
PUT /api/v1/admin/users/{user_id}/status?is_active=true
DELETE /api/v1/admin/users/{user_id}
```

### Analytics
```
GET /api/v1/admin/analytics/inspections?days=30
GET /api/v1/admin/analytics/properties
```

### System
```
GET /api/v1/admin/system/metrics
```

---

## 🎨 UI Components

### Color Coding

**Status Indicators:**
- 🟢 Green: Active, Operational, Good performance
- 🟡 Yellow: Warning, Moderate performance
- 🔴 Red: Inactive, Error, Poor performance

**Role Badges:**
- User: Default role
- Inspector: Professional users
- Admin: Full access

---

## 🚀 Getting Started

### 1. Promote Your First Admin

**Option A: Via Database (PostgreSQL)**
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Option B: Via API (if you have access)**
```bash
curl -X PUT "https://your-api.com/api/v1/admin/users/1/role?role=admin" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Access the Admin Console

1. Log in to your account
2. Click "Admin Panel" in the top navigation
3. You'll be redirected to `/admin`

### 3. Explore Features

- Start with the Dashboard for an overview
- Check User Management to see all users
- Review Analytics for insights
- Monitor System Metrics for health

---

## 📈 Best Practices

### User Management
- ✅ Regularly review user activity
- ✅ Promote active users to inspector role
- ✅ Deactivate instead of deleting when possible
- ❌ Don't delete users with active inspections without backup

### Monitoring
- ✅ Check system metrics daily
- ✅ Monitor uptime and response times
- ✅ Track storage usage to avoid limits
- ✅ Review analytics weekly for trends

### Security
- ✅ Limit admin access to trusted users only
- ✅ Use strong passwords for admin accounts
- ✅ Log out when not using admin console
- ❌ Don't share admin credentials

---

## 🔒 Security Features

**Role-Based Access Control:**
- Only users with `role = 'admin'` can access admin routes
- Backend validates admin status on every request
- Frontend hides admin links from non-admin users

**Protected Routes:**
- All admin endpoints require authentication
- Admin role check via `require_admin` dependency
- 403 Forbidden error for non-admin access attempts

**Audit Trail:**
- User actions are logged (future enhancement)
- Track who made changes and when
- Monitor suspicious activity

---

## 🛠️ Customization

### Adding New Metrics

1. **Backend:** Add endpoint in `backend/api/admin_routes.py`
2. **Schema:** Define response model in `backend/schemas/admin.py`
3. **Frontend:** Add API call in `frontend/src/services/api.ts`
4. **UI:** Create component in admin pages

### Adding New Admin Pages

1. Create page component in `frontend/src/pages/admin/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation item in `frontend/src/components/AdminLayout.tsx`

---

## 📱 Mobile Responsiveness

The admin console is fully responsive:
- ✅ Works on tablets (768px+)
- ⚠️ Limited functionality on mobile phones
- 💡 Recommended: Use desktop or tablet for best experience

---

## 🐛 Troubleshooting

### "Access Denied" Error
**Problem:** User sees "Access Denied" message
**Solution:** Verify user has `role = 'admin'` in database

### Admin Panel Link Not Visible
**Problem:** Admin link doesn't appear in navigation
**Solution:** Check `user.role === 'admin'` in frontend

### API 403 Forbidden
**Problem:** Admin API calls return 403 error
**Solution:** Ensure JWT token is valid and user is admin

### Metrics Not Loading
**Problem:** Dashboard shows loading spinner indefinitely
**Solution:** Check backend logs, verify database connection

---

## 🎯 Future Enhancements

**Planned Features:**
- 📧 Email notifications for admin alerts
- 📝 Audit log viewer
- 💳 Billing and payment management
- 📊 Advanced charts with drill-down
- 🔍 Full-text search across all data
- 📤 Export data to CSV/Excel
- 🤖 AI-powered insights and recommendations
- 📱 Mobile app for admin tasks

---

## 📞 Support

For issues or questions about the admin console:
1. Check this documentation
2. Review backend logs in Railway
3. Check browser console for frontend errors
4. Contact your development team

---

## ✅ Admin Console Checklist

**Initial Setup:**
- [ ] Promote first admin user
- [ ] Access admin console successfully
- [ ] Review all dashboard metrics
- [ ] Test user management features
- [ ] Verify analytics are loading
- [ ] Check system metrics

**Regular Maintenance:**
- [ ] Review user activity weekly
- [ ] Monitor system metrics daily
- [ ] Check analytics for trends
- [ ] Manage inactive users monthly
- [ ] Review storage usage weekly

---

**Your admin console is now ready to use!** 🎉
