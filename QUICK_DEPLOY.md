# ⚡ Quick Deploy - 10 Minutes to Live

## Prerequisites
- GitHub account
- Your code pushed to GitHub

---

## Step 1: Deploy Backend (Railway) - 3 minutes

1. **Go to https://railway.app**
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Python ✅

3. **Add Environment Variables**
   Click "Variables" tab and add:
   ```
   SECRET_KEY=generate-a-random-string-here
   OPENAI_API_KEY=your-openai-key
   ANTHROPIC_API_KEY=your-anthropic-key
   ```
   
   Note: Railway automatically provides `DATABASE_URL`

4. **Get Your Backend URL**
   - Click "Settings" → "Generate Domain"
   - Copy the URL (e.g., `https://your-app.railway.app`)
   - Save this for Step 2!

---

## Step 2: Deploy Frontend (Vercel) - 3 minutes

1. **Go to https://vercel.com**
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Add Environment Variable**
   - Click "Environment Variables"
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://your-app.railway.app (from Step 1)
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL! 🎉

---

## Step 3: Update CORS - 2 minutes

1. **Go back to Railway**
   - Click your project
   - Click "Variables"
   - Add new variable:
     ```
     CORS_ORIGINS=https://your-app.vercel.app
     ```
   - Replace with your actual Vercel URL

2. **Redeploy**
   - Railway will auto-redeploy
   - Wait 1 minute

---

## Step 4: Test Your Live App - 2 minutes

1. **Visit your Vercel URL**
   - Should see your landing page ✅

2. **Test Registration**
   - Click "Get Started"
   - Create an account
   - Should work! ✅

3. **Test Inspection**
   - Upload some photos
   - Generate a report
   - Download PDF ✅

---

## 🎉 You're Live!

Your app is now running at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app

---

## Next Steps (Optional)

### Add Custom Domain
1. Buy domain (Namecheap, Google Domains)
2. In Vercel: Settings → Domains → Add
3. Follow DNS instructions
4. Wait 10 minutes for SSL

### Set Up Monitoring
1. Add Google Analytics to `frontend/index.html`
2. Set up Sentry for error tracking
3. Use UptimeRobot for uptime monitoring

### Optimize
1. Add caching headers
2. Optimize images
3. Enable compression
4. Set up CDN

---

## 💰 Costs

**Free Tier (Perfect for Starting):**
- Railway: $5 credit/month (enough for small app)
- Vercel: Free (100GB bandwidth)
- **Total: $0-5/month**

**When You Grow:**
- Railway: ~$10-20/month
- Vercel Pro: $20/month
- **Total: ~$30-40/month**

---

## 🆘 Troubleshooting

### "Cannot connect to backend"
- Check `VITE_API_URL` in Vercel
- Check `CORS_ORIGINS` in Railway
- Wait 2 minutes for changes to deploy

### "Database connection error"
- Railway auto-provides database
- Check Railway logs for errors
- Restart the service

### "Build failed"
- Check build logs in Vercel/Railway
- Verify all dependencies in package.json
- Try deploying again

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Check deployment logs for specific errors

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Test registration works
- [ ] Test inspection works
- [ ] Test PDF generation
- [ ] Add custom domain (optional)
- [ ] Set up analytics (optional)
- [ ] Set up monitoring (optional)

**You're ready to share your app with the world!** 🚀
