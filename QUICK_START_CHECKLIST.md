# ✅ InspectIQ Quick Start Checklist

Follow these steps in order to get your app running in 10 minutes!

---

## 📋 Pre-Requirements

- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed
- [ ] OpenAI API key (with GPT-4 Vision access)

---

## 🔧 Backend Setup (5 minutes)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```
- [ ] No errors during installation

### 2. Create Database
```bash
createdb inspectiq
```
- [ ] Database created successfully

### 3. Configure Environment
```bash
copy .env.example .env
```

Edit `.env` file:
- [ ] Set `OPENAI_API_KEY=sk-your-key-here`
- [ ] Set `DATABASE_URL=postgresql://postgres:password@localhost:5432/inspectiq`
- [ ] Set `SECRET_KEY=` (generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)

### 4. Start Backend
```bash
uvicorn main:app --reload
```
- [ ] Server starts without errors
- [ ] See "Application startup complete"
- [ ] Visit http://localhost:8000 - should see JSON response
- [ ] Visit http://localhost:8000/docs - should see API documentation

---

## 🎨 Frontend Setup (5 minutes)

### 1. Navigate to Frontend
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```
- [ ] No errors during installation

### 3. Configure Environment
```bash
copy .env.example .env
```
- [ ] File created (default values are fine)

### 4. Start Frontend
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] See "Local: http://localhost:3000"
- [ ] Visit http://localhost:3000 - should see login page

---

## 🧪 Test the Application (5 minutes)

### 1. Register Account
- [ ] Go to http://localhost:3000
- [ ] Click "Sign up"
- [ ] Enter:
  - Name: Test User
  - Email: test@example.com
  - Password: password123
- [ ] Click "Sign up"
- [ ] Redirected to dashboard

### 2. Add Property
- [ ] Click "Properties" in navigation
- [ ] Click "Add Property"
- [ ] Fill in:
  - Address Line 1: 123 Main St
  - City: San Francisco
  - State: CA
  - Postal Code: 94102
  - Property Type: Apartment
- [ ] Click "Create Property"
- [ ] Property appears in list

### 3. Create Inspection
- [ ] Click on your property
- [ ] Click "New Inspection"
- [ ] **Step 1**: 
  - Property should be pre-selected
  - Select "Move In" type
  - Click "Next"
- [ ] **Step 2**:
  - Click "Add Room"
  - Select "Living Room"
  - Click "Add Photo URL"
  - Enter: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2`
  - Click "Review"
- [ ] **Step 3**:
  - Review details
  - Click "Create & Analyze"
- [ ] Wait for analysis (10-30 seconds)

### 4. View Results
- [ ] Inspection detail page loads
- [ ] See status change to "completed"
- [ ] See summary stats (issues, cost, severity)
- [ ] See detected issues (if any)
- [ ] See full report

---

## ✅ Success Criteria

If all checkboxes are checked, your app is working! 🎉

### Backend Working
- [x] Server starts on port 8000
- [x] API docs accessible
- [x] Database tables created
- [x] No errors in terminal

### Frontend Working
- [x] App loads on port 3000
- [x] Login page displays
- [x] Can register new user
- [x] Dashboard loads after login

### Full Flow Working
- [x] Can create property
- [x] Can create inspection
- [x] AI analysis runs
- [x] Results display correctly

---

## 🐛 Common Issues

### Backend Won't Start

**Error: "Database connection failed"**
```bash
# Check PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Test connection
psql -U postgres -d inspectiq
```

**Error: "OpenAI API key not found"**
- Check `.env` file exists in root directory
- Verify `OPENAI_API_KEY` is set
- No quotes around the key value

**Error: "Module not found"**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Won't Start

**Error: "Cannot find module"**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 3000 already in use"**
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill
```

### Can't Connect Frontend to Backend

**Error: "Network Error" or "CORS"**
- Verify backend is running on port 8000
- Check `VITE_API_URL` in `frontend/.env`
- Check browser console for specific error

### AI Analysis Fails

**Error: "Analysis failed"**
- Verify OpenAI API key is correct
- Check you have GPT-4 Vision access
- Verify image URLs are publicly accessible
- Check OpenAI API status: https://status.openai.com

---

## 📞 Need Help?

### Check Documentation
1. **FINAL_SETUP_INSTRUCTIONS.md** - Detailed setup
2. **TROUBLESHOOTING.md** - Common issues
3. **API_EXAMPLES.md** - API usage

### Check Logs
- **Backend**: Check terminal where uvicorn is running
- **Frontend**: Check browser console (F12)
- **Database**: `psql -d inspectiq` then `\dt` to see tables

### Test Components
- **API**: http://localhost:8000/docs
- **Database**: `psql -U postgres -d inspectiq`
- **Frontend**: Check browser Network tab

---

## 🎯 Next Steps

Once everything is working:

1. **Test with Real Photos**
   - Upload actual property photos
   - Test different room types
   - Verify AI detection accuracy

2. **Explore Features**
   - Create multiple properties
   - Run different inspection types
   - Compare results

3. **Customize**
   - Adjust AI prompts in `agents/` directory
   - Modify UI in `frontend/src/`
   - Add new features

4. **Deploy**
   - Follow DEPLOYMENT_CHECKLIST.md
   - Set up production database
   - Configure production environment

---

## 🎉 You're Done!

If all checkboxes are checked, congratulations! Your InspectIQ MVP is running successfully!

**Time to start testing and gathering feedback!** 🚀

---

**Quick Reference:**
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- Database: `psql -d inspectiq`
