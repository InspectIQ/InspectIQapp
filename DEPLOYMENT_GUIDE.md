# 🚀 Deployment Guide - InspectIQ

## Overview

Your app has two parts that need hosting:
1. **Frontend** (React/Vite) - Marketing site + App UI
2. **Backend** (Python/FastAPI) - API + Database

---

## 🎯 Recommended: Vercel + Railway (Easiest)

### Why This Combo?
- ✅ **Free tier available** for both
- ✅ **Automatic deployments** from GitHub
- ✅ **SSL certificates** included
- ✅ **Easy setup** (5-10 minutes)
- ✅ **Great performance**

---

## Option 1: Vercel (Frontend) + Railway (Backend)

### Step 1: Deploy Backend to Railway

**1. Sign up for Railway**
- Go to https://railway.app
- Sign up with GitHub

**2. Create New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your repository
- Railway will auto-detect Python

**3. Configure Environment Variables**
In Railway dashboard, add these variables:
```
DATABASE_URL=postgresql://...  (Railway provides this automatically)
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
CORS_ORIGINS=https://your-domain.vercel.app
```

**4. Add Railway Config**
Create `railway.json` in your project root:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn backend.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**5. Deploy**
- Railway will automatically deploy
- You'll get a URL like: `https://your-app.railway.app`
- Copy this URL for frontend configuration

---

### Step 2: Deploy Frontend to Vercel

**1. Sign up for Vercel**
- Go to https://vercel.com
- Sign up with GitHub

**2. Import Project**
- Click "Add New Project"
- Import your GitHub repository
- Vercel auto-detects Vite

**3. Configure Build Settings**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**4. Add Environment Variables**
```
VITE_API_URL=https://your-app.railway.app
```

**5. Deploy**
- Click "Deploy"
- You'll get a URL like: `https://your-app.vercel.app`

**6. Add Custom Domain (Optional)**
- Go to Project Settings → Domains
- Add your custom domain (e.g., inspectiq.com)
- Follow DNS instructions

---

## Option 2: Netlify (Frontend) + Render (Backend)

### Frontend on Netlify

**1. Sign up at https://netlify.com**

**2. Deploy**
```bash
cd frontend
npm run build
```

**3. Drag & Drop**
- Drag the `dist` folder to Netlify
- Or connect GitHub for auto-deploy

**4. Environment Variables**
- Site Settings → Environment Variables
- Add `VITE_API_URL`

### Backend on Render

**1. Sign up at https://render.com**

**2. Create Web Service**
- New → Web Service
- Connect GitHub repo
- Select Python environment

**3. Configure**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

**4. Add Environment Variables**
- Same as Railway setup above

---

## Option 3: DigitalOcean App Platform (All-in-One)

### Why DigitalOcean?
- ✅ Host both frontend & backend together
- ✅ Managed database included
- ✅ $5-12/month
- ✅ More control than free tiers

### Setup

**1. Sign up at https://digitalocean.com**

**2. Create App**
- Apps → Create App
- Connect GitHub repository

**3. Configure Components**

**Frontend Component:**
```yaml
name: frontend
source_dir: /frontend
build_command: npm run build
run_command: npm run preview
```

**Backend Component:**
```yaml
name: backend
source_dir: /
build_command: pip install -r requirements.txt
run_command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

**Database Component:**
- Add PostgreSQL database
- DigitalOcean auto-configures connection

**4. Deploy**
- Click "Create Resources"
- Wait 5-10 minutes
- Get your live URLs

---

## Option 4: AWS (Production-Grade)

### For Serious Production Use

**Frontend: AWS Amplify or S3 + CloudFront**
**Backend: AWS Elastic Beanstalk or ECS**
**Database: AWS RDS (PostgreSQL)**

This is more complex but offers:
- ✅ Maximum scalability
- ✅ Enterprise features
- ✅ Full control
- ❌ More expensive
- ❌ Steeper learning curve

---

## 🔧 Pre-Deployment Checklist

### 1. Update API URL in Frontend

**Create `.env.production` in frontend folder:**
```env
VITE_API_URL=https://your-backend-url.com
```

### 2. Update CORS in Backend

**In `backend/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-url.vercel.app",
        "https://your-custom-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Set Up Database

**Option A: Use hosting provider's database**
- Railway, Render, DigitalOcean all offer managed PostgreSQL

**Option B: Separate database service**
- Supabase (free tier): https://supabase.com
- ElephantSQL (free tier): https://elephantsql.com
- Neon (free tier): https://neon.tech

### 4. Environment Variables Needed

**Backend:**
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secret-key-generate-new-one
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
CORS_ORIGINS=https://your-frontend.com
```

**Frontend:**
```
VITE_API_URL=https://your-backend.com
```

### 5. Build and Test Locally

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run build
npm run preview
```

---

## 📝 Quick Start: Vercel + Railway (Recommended)

### 5-Minute Setup

**1. Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**2. Deploy Backend (Railway)**
- Go to https://railway.app
- "New Project" → "Deploy from GitHub"
- Select your repo
- Add environment variables
- Deploy! (2 minutes)

**3. Deploy Frontend (Vercel)**
- Go to https://vercel.com
- "New Project" → Import from GitHub
- Select your repo
- Set root directory to `frontend`
- Add `VITE_API_URL` environment variable
- Deploy! (2 minutes)

**4. Update CORS**
- Go back to Railway
- Update `CORS_ORIGINS` with your Vercel URL
- Redeploy

**Done!** Your app is live! 🎉

---

## 🌐 Custom Domain Setup

### After Deployment

**1. Buy Domain**
- Namecheap: https://namecheap.com
- Google Domains: https://domains.google
- GoDaddy: https://godaddy.com

**2. Configure DNS**

**For Vercel:**
- Add domain in Vercel dashboard
- Update DNS records:
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```

**For Railway:**
- Add custom domain in Railway
- Update DNS:
  ```
  Type: CNAME
  Name: api
  Value: your-app.railway.app
  ```

**3. SSL Certificate**
- Both Vercel and Railway auto-provision SSL
- Wait 5-10 minutes for DNS propagation

---

## 💰 Cost Comparison

### Free Tier (Good for MVP/Testing)
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: $5 credit/month (enough for small app)
- **Netlify**: Free (100GB bandwidth/month)
- **Render**: Free (spins down after inactivity)
- **Total**: $0-5/month

### Paid Tier (Production)
- **Vercel Pro**: $20/month
- **Railway**: ~$10-20/month (usage-based)
- **DigitalOcean**: $12-24/month
- **Total**: $30-50/month

### Enterprise
- **AWS/GCP/Azure**: $100-500+/month
- Full control, maximum scale

---

## 🔒 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Generate new SECRET_KEY
- [ ] Enable HTTPS only
- [ ] Set up proper CORS
- [ ] Add rate limiting
- [ ] Enable database backups
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Add Google Analytics
- [ ] Test all forms and APIs
- [ ] Check mobile responsiveness

---

## 📊 Post-Deployment

### 1. Set Up Analytics
```html
<!-- Add to frontend/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. Set Up Error Tracking
- Sentry: https://sentry.io (free tier)
- LogRocket: https://logrocket.com

### 3. Set Up Uptime Monitoring
- UptimeRobot: https://uptimerobot.com (free)
- Pingdom: https://pingdom.com

### 4. Submit to Google
- Google Search Console: https://search.google.com/search-console
- Submit your sitemap: `https://your-domain.com/sitemap.xml`

---

## 🆘 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` is correct
- Check CORS settings in backend
- Check browser console for errors

### Database connection fails
- Verify `DATABASE_URL` format
- Check database is running
- Verify firewall rules

### Build fails
- Check Node.js version (use v18+)
- Check Python version (use 3.11+)
- Clear cache and rebuild

### SSL certificate issues
- Wait 10-15 minutes for DNS propagation
- Check DNS records are correct
- Contact hosting support

---

## 🎯 My Recommendation

**For You (Starting Out):**

1. **Start with Vercel + Railway**
   - Free/cheap to start
   - Easy to set up
   - Scales as you grow
   - Professional URLs

2. **Add Custom Domain**
   - Buy domain on Namecheap ($10/year)
   - Point to Vercel
   - Looks professional

3. **Upgrade When Needed**
   - Start free
   - Upgrade to paid when you get customers
   - Move to DigitalOcean/AWS when scaling

**Total Cost to Start: $0-5/month** ✨

---

## 📞 Need Help?

If you get stuck:
1. Check hosting provider docs
2. Search Stack Overflow
3. Ask in hosting provider Discord/Slack
4. Check deployment logs for errors

---

## 🚀 Ready to Deploy?

Follow the "Quick Start: Vercel + Railway" section above and you'll be live in 10 minutes!

Good luck! 🎉
