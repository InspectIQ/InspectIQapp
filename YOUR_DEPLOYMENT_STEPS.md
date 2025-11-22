# 🚀 Your Personal Deployment Guide - InspectIQ

## Your GitHub: https://github.com/InspectIQ

---

## ⚡ STEP-BY-STEP DEPLOYMENT (10 Minutes)

### Before You Start
Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

---

## STEP 1: Deploy Backend to Railway (3 minutes)

### 1.1 Sign Up & Connect
1. Go to **https://railway.app**
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub

### 1.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **InspectIQ** organization
4. Select your repository (the one with this code)
5. Railway will automatically detect Python ✅

### 1.3 Add Environment Variables
Click the **"Variables"** tab and add these:

**Required Variables:**
```
SECRET_KEY
```
Generate a secure key by running this in your terminal:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy the output and paste it as the SECRET_KEY value.

```
OPENAI_API_KEY=sk-your-openai-key-here
```
Get from: https://platform.openai.com/api-keys

```
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
```
Get from: https://console.anthropic.com/settings/keys

**Note:** Railway automatically provides `DATABASE_URL` - you don't need to add it!

### 1.4 Generate Domain
1. Click **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://inspectiq-production.railway.app`
5. **COPY THIS URL** - you'll need it for Step 2!

### 1.5 Wait for Deployment
- Watch the deployment logs
- Should take 2-3 minutes
- Look for "Build successful" ✅

**Your Backend URL:** `_______________________________`
(Write it down!)

---

## STEP 2: Deploy Frontend to Vercel (3 minutes)

### 2.1 Sign Up & Connect
1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find your InspectIQ repository
3. Click **"Import"**

### 2.3 Configure Build Settings
Vercel should auto-detect these, but verify:

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.4 Add Environment Variable
**CRITICAL STEP:**

1. Scroll down to **"Environment Variables"**
2. Add this variable:
   ```
   Name: VITE_API_URL
   Value: https://inspectiq-production.railway.app
   ```
   ⚠️ **Use YOUR Railway URL from Step 1.4!**

3. Select **"Production"** environment

### 2.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Vercel will show you the live URL!

**Your Frontend URL:** `_______________________________`
(Write it down!)

---

## STEP 3: Update CORS Settings (2 minutes)

Now we need to tell the backend to accept requests from your frontend.

### 3.1 Go Back to Railway
1. Open **https://railway.app**
2. Click on your project
3. Click **"Variables"** tab

### 3.2 Add CORS Variable
Add a new variable:
```
Name: CORS_ORIGINS
Value: https://your-app.vercel.app
```
⚠️ **Use YOUR Vercel URL from Step 2.5!**

Example:
```
CORS_ORIGINS=https://inspectiq-abc123.vercel.app
```

### 3.3 Redeploy
- Railway will automatically redeploy
- Wait 1-2 minutes
- Check logs for "Build successful"

---

## STEP 4: Test Your Live App! (2 minutes)

### 4.1 Visit Your Site
Open your Vercel URL in a browser

### 4.2 Test Registration
1. Click **"Get Started"**
2. Create a new account
3. Should redirect to dashboard ✅

### 4.3 Test Inspection
1. Click **"New Inspection"**
2. Upload some test photos
3. Generate a report
4. Download the PDF ✅

### 4.4 Test All Pages
- Landing page ✅
- Pricing page ✅
- Demo page ✅
- About page ✅
- Contact form ✅

---

## 🎉 YOU'RE LIVE!

Your app is now running at:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://inspectiq-production.railway.app
- **Database:** Managed by Railway

---

## 📊 What You're Running On

### Free Tier Limits:
- **Railway:** $5 credit/month (enough for ~500 requests/day)
- **Vercel:** 100GB bandwidth/month (plenty for starting)
- **Cost:** $0-5/month

### When to Upgrade:
- Railway: When you exceed $5/month usage
- Vercel: When you exceed 100GB bandwidth
- Typical upgrade cost: $30-50/month

---

## 🔧 Common Issues & Fixes

### "Cannot connect to backend"
**Problem:** Frontend can't reach backend
**Fix:**
1. Check `VITE_API_URL` in Vercel matches your Railway URL
2. Check `CORS_ORIGINS` in Railway matches your Vercel URL
3. Make sure both URLs are HTTPS (not HTTP)
4. Wait 2 minutes for changes to deploy

### "Database connection error"
**Problem:** Backend can't connect to database
**Fix:**
1. Railway provides DATABASE_URL automatically
2. Check Railway logs for specific error
3. Try restarting the service in Railway
4. Make sure you didn't manually add DATABASE_URL

### "Build failed" on Vercel
**Problem:** Frontend build errors
**Fix:**
1. Check build logs in Vercel dashboard
2. Make sure `Root Directory` is set to `frontend`
3. Make sure `Build Command` is `npm run build`
4. Try redeploying

### "Build failed" on Railway
**Problem:** Backend build errors
**Fix:**
1. Check Railway logs for specific error
2. Make sure `requirements.txt` is in root directory
3. Make sure all environment variables are set
4. Try redeploying

---

## 🎯 Next Steps (Optional)

### 1. Add Custom Domain
**Cost:** ~$10-15/year

1. Buy domain from:
   - Namecheap: https://namecheap.com
   - Google Domains: https://domains.google.com
   - Cloudflare: https://cloudflare.com

2. In Vercel:
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., inspectiq.com)
   - Follow DNS instructions

3. In Railway (for API):
   - Go to Settings → Domains
   - Add custom domain (e.g., api.inspectiq.com)
   - Update DNS records

4. Update CORS:
   - In Railway, update `CORS_ORIGINS` to include your custom domain
   - In Vercel, update `VITE_API_URL` to your custom API domain

### 2. Set Up Analytics
Add to `frontend/index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Get tracking ID from: https://analytics.google.com

### 3. Set Up Error Tracking
**Sentry (Free tier):**
1. Sign up at https://sentry.io
2. Create new project
3. Add Sentry SDK to your code
4. Get notified of errors in production

### 4. Set Up Uptime Monitoring
**UptimeRobot (Free):**
1. Sign up at https://uptimerobot.com
2. Add your Vercel URL
3. Get alerts if site goes down

### 5. Submit to Google
1. Go to https://search.google.com/search-console
2. Add your domain
3. Submit sitemap: `https://your-domain.com/sitemap.xml`
4. Wait for Google to index your site

---

## 📞 Need Help?

### If You Get Stuck:

1. **Check the logs:**
   - Railway: Click project → "Deployments" → View logs
   - Vercel: Click deployment → "View Function Logs"

2. **Common fixes:**
   - Wait 2-3 minutes after making changes
   - Try redeploying
   - Check all URLs are HTTPS
   - Verify environment variables are correct

3. **Documentation:**
   - Railway: https://docs.railway.app
   - Vercel: https://vercel.com/docs

4. **Ask me!**
   - Share the error message
   - Share screenshots of your settings
   - I'll help troubleshoot

---

## ✅ Deployment Checklist

Print this and check off as you go:

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] Environment variables added (SECRET_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY)
- [ ] Railway domain generated
- [ ] Backend URL copied
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] VITE_API_URL environment variable added
- [ ] Frontend URL copied
- [ ] CORS_ORIGINS added to Railway
- [ ] Both services redeployed
- [ ] Registration tested
- [ ] Login tested
- [ ] Inspection tested
- [ ] PDF generation tested
- [ ] All pages loading

**Optional:**
- [ ] Custom domain added
- [ ] Google Analytics added
- [ ] Error tracking set up
- [ ] Uptime monitoring set up
- [ ] Sitemap submitted to Google

---

## 🎊 Congratulations!

You've successfully deployed InspectIQ to production!

**Share your live URL:**
- Frontend: `_______________________________`
- Backend: `_______________________________`

**Your app is now:**
- ✅ Live on the internet
- ✅ Secured with HTTPS
- ✅ Backed by a real database
- ✅ Ready for real users
- ✅ Scalable as you grow

**Now go get some customers!** 🚀
