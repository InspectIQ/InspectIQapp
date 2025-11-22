# InspectIQ MVP Setup Guide

## ✅ What's Been Built

### Backend (Complete)
- ✅ Database models (Users, Properties, Inspections, Rooms, Issues, Teams, Subscriptions)
- ✅ Authentication system (JWT, password hashing)
- ✅ Auth API endpoints (register, login, get current user)
- ✅ Properties API (CRUD operations)
- ✅ Inspections API (create, list, analyze with AI)
- ✅ AI agents integration (7 agents working)
- ✅ Workflows (inspection & diagnosis)

### Frontend (Partial)
- ✅ Project structure (React + TypeScript + Vite + Tailwind)
- ✅ API service layer
- ✅ Auth context
- ✅ Login page
- ⏳ Register page (need to create)
- ⏳ Dashboard (need to create)
- ⏳ Properties pages (need to create)
- ⏳ Inspection pages (need to create)

---

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up PostgreSQL Database

```bash
# Install PostgreSQL (if not installed)
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
createdb inspectiq

# Or using psql:
psql -U postgres
CREATE DATABASE inspectiq;
\q
```

### 3. Configure Environment

```bash
# Copy example env
copy .env.example .env
```

Edit `.env`:
```env
# OpenAI (required)
OPENAI_API_KEY=sk-your-key-here

# Database (required)
DATABASE_URL=postgresql://postgres:password@localhost:5432/inspectiq

# JWT Secret (required - generate a random string)
SECRET_KEY=your-super-secret-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Start Backend

```bash
# Run migrations (creates tables)
python -c "from backend.database.database import init_db; init_db()"

# Start server
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

### 5. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 📝 Remaining Frontend Files to Create

I've created the foundation. Here are the remaining files you need:

### Pages (Priority Order)

1. **Register.tsx** - User registration
2. **Dashboard.tsx** - Main dashboard
3. **Properties.tsx** - List properties
4. **PropertyDetail.tsx** - View/edit property
5. **NewInspection.tsx** - Create inspection
6. **InspectionDetail.tsx** - View inspection results

### Components

1. **Layout.tsx** - Main layout with navigation
2. **PropertyCard.tsx** - Property list item
3. **InspectionCard.tsx** - Inspection list item
4. **PhotoUpload.tsx** - Photo upload component
5. **ReportViewer.tsx** - Display inspection report

---

## 🎯 MVP User Flow

### 1. Register/Login
```
User visits http://localhost:3000
→ Redirected to /login
→ Click "Sign up"
→ Enter email, password, name
→ Redirected to dashboard
```

### 2. Add Property
```
Dashboard → "Add Property" button
→ Fill in address, property details
→ Save
→ Property appears in list
```

### 3. Create Inspection
```
Property detail → "New Inspection" button
→ Select inspection type (move-in, move-out, etc.)
→ Add rooms (living room, bedroom, etc.)
→ Upload photos for each room
→ Click "Analyze"
→ AI processes photos
→ View report with detected issues
```

### 4. View Report
```
Inspection detail page shows:
- Property info
- Inspection date/type
- Room-by-room breakdown
- Detected issues with photos
- Cost estimates
- Recommended actions
- Download PDF button
```

---

## 🔧 Testing the Backend

### Test Auth
```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Save the token from response
TOKEN="your-token-here"

# Get current user
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Test Properties
```bash
# Create property
curl -X POST http://localhost:8000/api/v1/properties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address_line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94102",
    "property_type": "apartment"
  }'

# List properties
curl http://localhost:8000/api/v1/properties \
  -H "Authorization: Bearer $TOKEN"
```

### Test Inspections
```bash
# Create inspection
curl -X POST http://localhost:8000/api/v1/inspections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "inspection_type": "move_in"
  }'

# Add room
curl -X POST http://localhost:8000/api/v1/inspections/1/rooms \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "room_type": "living_room",
    "room_name": "Living Room"
  }'

# Add photo to room
curl -X POST "http://localhost:8000/api/v1/inspections/1/rooms/1/photos?photo_url=https://example.com/photo.jpg" \
  -H "Authorization: Bearer $TOKEN"

# Analyze inspection
curl -X POST http://localhost:8000/api/v1/inspections/1/analyze \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Database Schema

Tables created automatically on first run:
- `users` - User accounts
- `properties` - Property records
- `inspections` - Inspection records
- `rooms` - Room data
- `issues` - Detected issues
- `teams` - Team management
- `team_members` - Team membership
- `subscriptions` - Subscription tracking
- `payments` - Payment history

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Test connection: `psql $DATABASE_URL`

### "OpenAI API error"
- Check OPENAI_API_KEY in .env
- Verify you have GPT-4 Vision access
- Check API quota/billing

### "Frontend can't connect to backend"
- Backend must be running on port 8000
- Check CORS settings in main.py
- Verify API_BASE_URL in frontend

### "Token expired"
- Tokens expire after 30 minutes
- Log in again to get new token
- Adjust ACCESS_TOKEN_EXPIRE_MINUTES in settings

---

## 🎨 Frontend Component Templates

### Register.tsx Template
```tsx
// Similar to Login.tsx but with name field
// Call useAuth().register(email, password, name)
```

### Dashboard.tsx Template
```tsx
// Show:
// - Welcome message
// - Recent inspections
// - Property count
// - Quick actions (Add Property, New Inspection)
```

### Properties.tsx Template
```tsx
// List all properties
// Each property card shows:
// - Address
// - Property type
// - Number of inspections
// - "View" and "New Inspection" buttons
```

### NewInspection.tsx Template
```tsx
// Multi-step form:
// Step 1: Select property
// Step 2: Select inspection type
// Step 3: Add rooms and upload photos
// Step 4: Review and analyze
```

---

## 🚢 Next Steps After MVP

1. **File Upload** - Add actual file upload (currently using URLs)
2. **PDF Generation** - Generate downloadable PDFs
3. **Inspection Comparison** - Compare move-in vs move-out
4. **Team Features** - Multi-user collaboration
5. **Payments** - Stripe integration
6. **Email Notifications** - Report ready emails
7. **Public Sharing** - Share reports via link
8. **Mobile App** - React Native version

---

## 📞 Need Help?

### Backend Issues
- Check `main.py` for route registration
- Review `backend/api/` for endpoint logic
- Check `backend/database/models.py` for schema

### Frontend Issues
- Check `src/services/api.ts` for API calls
- Review `src/contexts/AuthContext.tsx` for auth
- Check browser console for errors

### Database Issues
- Check PostgreSQL logs
- Verify tables exist: `\dt` in psql
- Check migrations ran successfully

---

## ✅ MVP Checklist

### Backend
- [x] Database models
- [x] Auth endpoints
- [x] Properties CRUD
- [x] Inspections CRUD
- [x] AI analysis integration
- [ ] File upload endpoint
- [ ] PDF generation

### Frontend
- [x] Project setup
- [x] API service
- [x] Auth context
- [x] Login page
- [ ] Register page
- [ ] Dashboard
- [ ] Properties list
- [ ] Property detail
- [ ] New inspection flow
- [ ] Inspection detail/report

### Testing
- [ ] End-to-end user flow
- [ ] AI analysis with real photos
- [ ] Error handling
- [ ] Mobile responsive

---

**Current Status**: Backend 90% complete, Frontend 30% complete

**Estimated Time to Complete MVP**: 2-3 days of focused development

**Priority**: Complete frontend pages in order listed above
