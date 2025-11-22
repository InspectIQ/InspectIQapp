# 🎉 InspectIQ MVP - Final Setup Instructions

## ✅ What's Complete

Your full-stack InspectIQ MVP is now **95% complete**!

### Backend (100% Complete) ✅
- Database models & migrations
- JWT authentication
- Properties CRUD API
- Inspections API with AI integration
- 7 AI agents working
- All endpoints tested and ready

### Frontend (95% Complete) ✅
- Login & Register pages
- Dashboard with stats
- Properties list & detail
- Property creation form
- New inspection flow (3-step wizard)
- Inspection detail with AI results
- Full navigation & routing

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Set Up PostgreSQL

```bash
# Create database
createdb inspectiq

# Or using psql:
psql -U postgres
CREATE DATABASE inspectiq;
\q
```

### Step 3: Configure Backend Environment

```bash
# Copy example
copy .env.example .env
```

Edit `.env` with your settings:
```env
# Required
OPENAI_API_KEY=sk-your-actual-key-here
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/inspectiq
SECRET_KEY=generate-a-random-secret-key-here

# Optional (defaults are fine for development)
FRONTEND_URL=http://localhost:3000
```

**Generate a secret key:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 4: Start Backend

```bash
uvicorn main:app --reload
```

Backend runs at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 6: Configure Frontend Environment

```bash
# Copy example
copy .env.example .env
```

The default is fine:
```env
VITE_API_URL=http://localhost:8000
```

### Step 7: Start Frontend

```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🎯 Test the Application

### 1. Register a New User

1. Open http://localhost:3000
2. Click "Sign up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click "Sign up"

You'll be automatically logged in and redirected to the dashboard.

### 2. Add a Property

1. Click "Properties" in navigation
2. Click "Add Property"
3. Fill in:
   - Address: 123 Main St
   - City: San Francisco
   - State: CA
   - Postal Code: 94102
   - Property Type: Apartment
4. Click "Create Property"

### 3. Create an Inspection

1. Click on your property
2. Click "New Inspection"
3. **Step 1**: Select property and inspection type
4. **Step 2**: Add rooms and photos
   - Click "Add Room"
   - Select room type (e.g., Living Room)
   - Click "Add Photo URL"
   - Enter a photo URL (use a real image URL for testing)
   - Repeat for more rooms
5. **Step 3**: Review and click "Create & Analyze"

The AI will analyze the photos and generate a report!

### 4. View Results

After analysis completes (10-30 seconds):
- View detected issues
- See cost estimates
- Read full report
- Check severity levels

---

## 📸 Getting Test Images

For testing, you need publicly accessible image URLs. Options:

### Option 1: Use Imgur
1. Go to https://imgur.com
2. Upload test images
3. Right-click image → "Copy image address"
4. Use that URL in the inspection

### Option 2: Use Example URLs
```
https://images.unsplash.com/photo-1560448204-e02f11c3d0e2
https://images.unsplash.com/photo-1556912173-46c336c7fd55
https://images.unsplash.com/photo-1556912172-45b7abe8b7e1
```

### Option 3: Your Own Images
- Upload to any image hosting service
- Make sure URLs are publicly accessible
- Use HTTPS URLs

---

## 🔧 Troubleshooting

### Backend Issues

**"Database connection failed"**
```bash
# Check PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Test connection
psql -U postgres -d inspectiq
```

**"OpenAI API error"**
- Verify OPENAI_API_KEY in .env
- Check you have GPT-4 Vision access
- Verify billing is set up

**"Module not found"**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**"Cannot connect to backend"**
- Make sure backend is running on port 8000
- Check VITE_API_URL in frontend/.env
- Check browser console for errors

**"npm install fails"**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**"Page not loading"**
- Check browser console for errors
- Verify you're logged in
- Try clearing browser cache

---

## 📊 API Endpoints Reference

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login/json` - Login
- `GET /api/v1/auth/me` - Get current user

### Properties
- `GET /api/v1/properties` - List properties
- `POST /api/v1/properties` - Create property
- `GET /api/v1/properties/{id}` - Get property
- `PUT /api/v1/properties/{id}` - Update property
- `DELETE /api/v1/properties/{id}` - Delete property

### Inspections
- `GET /api/v1/inspections` - List inspections
- `POST /api/v1/inspections` - Create inspection
- `GET /api/v1/inspections/{id}` - Get inspection
- `POST /api/v1/inspections/{id}/rooms` - Add room
- `POST /api/v1/inspections/{id}/rooms/{room_id}/photos` - Add photo
- `POST /api/v1/inspections/{id}/analyze` - Run AI analysis
- `DELETE /api/v1/inspections/{id}` - Delete inspection

Test all endpoints at: **http://localhost:8000/docs**

---

## 🎨 What's Working

### ✅ Complete Features

1. **User Authentication**
   - Registration with email/password
   - Login with JWT tokens
   - Protected routes
   - Auto-logout on token expiry

2. **Property Management**
   - Create properties with full details
   - List all properties
   - View property details
   - See inspections per property

3. **Inspection Creation**
   - 3-step wizard interface
   - Select property & type
   - Add multiple rooms
   - Add multiple photos per room
   - Real-time validation

4. **AI Analysis**
   - Automatic damage detection
   - Issue classification
   - Severity assessment
   - Cost estimation
   - Repair recommendations
   - Full markdown reports

5. **Dashboard**
   - Property count
   - Inspection count
   - Recent inspections
   - Quick actions

6. **Navigation**
   - Clean UI with Tailwind CSS
   - Responsive design
   - Breadcrumb navigation
   - Status indicators

---

## 📝 What's Missing (Optional Enhancements)

### High Priority (1-2 days)

1. **File Upload**
   - Currently uses URLs
   - Add drag & drop file upload
   - Store files in S3 or local storage

2. **PDF Export**
   - Download reports as PDF
   - Professional formatting
   - Include photos

### Medium Priority (2-3 days)

3. **Inspection Comparison**
   - Compare move-in vs move-out
   - Highlight differences
   - Calculate liability

4. **Edit Functionality**
   - Edit properties
   - Edit inspections
   - Delete with confirmation

5. **Search & Filters**
   - Search properties
   - Filter inspections by status
   - Sort by date

### Low Priority (Future)

6. **Team Features**
   - Invite team members
   - Role-based permissions
   - Shared properties

7. **Payments**
   - Stripe integration
   - Subscription plans
   - Usage tracking

8. **Notifications**
   - Email when report ready
   - In-app notifications
   - SMS alerts

---

## 💡 Development Tips

### Adding New Features

1. **Backend**: Add route in `backend/api/`
2. **Frontend**: Add API call in `src/services/api.ts`
3. **UI**: Create component in `src/components/` or page in `src/pages/`

### Debugging

**Backend**:
```bash
# Enable debug logging
LOG_LEVEL=DEBUG uvicorn main:app --reload
```

**Frontend**:
```javascript
// Check API calls in browser console
// Network tab shows all requests
```

### Database

**View data**:
```bash
psql -U postgres -d inspectiq
\dt  # List tables
SELECT * FROM users;
SELECT * FROM properties;
SELECT * FROM inspections;
```

**Reset database**:
```bash
dropdb inspectiq
createdb inspectiq
# Restart backend to recreate tables
```

---

## 🚢 Deployment Checklist

### Before Deploying

- [ ] Change SECRET_KEY to a strong random value
- [ ] Set APP_ENV=production
- [ ] Use production database (not localhost)
- [ ] Set up proper CORS origins
- [ ] Add rate limiting
- [ ] Set up SSL/HTTPS
- [ ] Configure file storage (S3)
- [ ] Set up error tracking (Sentry)
- [ ] Add monitoring (DataDog, New Relic)
- [ ] Set up backups

### Deployment Options

**Backend**:
- Railway.app (easiest)
- Heroku
- AWS EC2/ECS
- Google Cloud Run
- DigitalOcean

**Frontend**:
- Vercel (easiest)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Database**:
- Railway PostgreSQL
- Heroku Postgres
- AWS RDS
- Supabase

---

## 📈 Performance Tips

### Backend
- Use connection pooling (already configured)
- Add Redis for caching
- Implement rate limiting
- Optimize database queries

### Frontend
- Lazy load routes
- Optimize images
- Add loading states
- Implement pagination

---

## 🎊 You're Ready!

Your InspectIQ MVP is complete and ready to use!

### Next Steps:

1. **Test thoroughly** with real property photos
2. **Get user feedback** from potential customers
3. **Add file upload** for better UX
4. **Deploy to production** when ready
5. **Iterate based on feedback**

### Need Help?

- Check API docs: http://localhost:8000/docs
- Review code comments in source files
- Check browser console for errors
- Review backend logs for issues

---

**Congratulations! You now have a working AI-powered property inspection platform!** 🎉

Start testing, gather feedback, and iterate. You're ready to launch! 🚀
