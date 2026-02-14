# 🚀 SETU Project Deployment Guide

This guide will help you deploy the SETU e-commerce platform to production.

## 📋 Overview

- **Frontend**: React + Vite → Vercel
- **Backend**: Node.js + Express → Render
- **Database**: MongoDB Atlas (already configured)

---

## 🔧 Prerequisites

1. **GitHub Account** (to push your code)
2. **Vercel Account** (sign up at https://vercel.com)
3. **Render Account** (sign up at https://render.com)
4. **MongoDB Atlas** (already set up with connection string)

---

## 📦 Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
cd c:\Users\Administrator\SETU
git add .
git commit -m "Prepare for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/setu-platform.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard (Recommended)

1. Go to https://render.com and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `setu-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://ludhiyaniharsha_db_user:XqMHAji2fe020yMA@cluster0.jlditfa.mongodb.net/?appName=Cluster0
   JWT_SECRET=setu_super_secret_key_2026_production
   JWT_EXPIRE=7d
   PORT=10000
   ```

6. Click **"Create Web Service"**

7. **Copy the deployed URL** (e.g., `https://setu-backend.onrender.com`)

### Option B: Using render.yaml

1. Go to https://render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Add the environment variables mentioned above

---

## 🌐 Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://setu-backend.onrender.com` (your backend URL from Step 2)

6. Click **"Deploy"**

7. Wait for deployment to complete (2-3 minutes)

8. **Copy the deployed URL** (e.g., `https://setu-platform.vercel.app`)

---

## 🔐 Step 4: Update CORS in Backend

After deploying, update your backend to allow requests from your frontend URL:

1. Go to Render Dashboard → Your Service → Environment
2. Add new environment variable:
   ```
   FRONTEND_URL=https://setu-platform.vercel.app
   ```

3. Update `backend/server.js` to use this (if not already):
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173'
   }));
   ```

4. Redeploy the backend service

---

## ✅ Step 5: Verify Deployment

1. Visit your Vercel URL: `https://setu-platform.vercel.app`
2. Test the following:
   - ✓ Landing page loads
   - ✓ User registration works
   - ✓ Login works
   - ✓ Product listing shows
   - ✓ Admin panel accessible

---

## 🎯 Quick Deploy Commands

### If you need to redeploy:

**Frontend (Vercel):**
```bash
cd frontend
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys on push
```

**Backend (Render):**
```bash
cd backend
git add .
git commit -m "Update backend"
git push
# Render auto-deploys on push
```

---

## 🔍 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set
- Ensure MongoDB URI is correct

**Problem**: Database connection fails
- Check MongoDB Atlas:
  - Network Access: Add `0.0.0.0/0` to whitelist
  - Database Access: Verify user credentials

### Frontend Issues

**Problem**: API calls failing
- Check `VITE_API_URL` environment variable
- Verify backend URL is correct and accessible
- Check browser console for CORS errors

**Problem**: 404 on refresh
- Vercel: Already configured with `vercel.json` rewrites
- If issue persists, check Vercel dashboard → Settings → Rewrites

### Common Issues

**Problem**: "Cannot GET /api/..."
- Backend might not be running
- Check backend URL is correct
- Wait for Render free tier to wake up (30s delay on first request)

---

## 📊 Monitoring

### Render
- **Logs**: Dashboard → Your Service → Logs
- **Metrics**: Dashboard → Your Service → Metrics

### Vercel
- **Analytics**: Dashboard → Your Project → Analytics
- **Logs**: Dashboard → Your Project → Deployments → View Logs

---

## 💰 Cost

- **Frontend (Vercel)**: Free tier includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS

- **Backend (Render)**: Free tier includes:
  - 750 hours/month (always on)
  - Automatic deploys
  - Sleeps after 15 min inactivity
  - 30s cold start time

- **Database (MongoDB Atlas)**: Free tier includes:
  - 512MB storage
  - Shared cluster
  - Already configured

---

## 🔄 Continuous Deployment

Both platforms support automatic deployment:
- **Push to GitHub** → Auto-deploys to Vercel & Render
- No manual intervention needed

---

## 🎉 You're Done!

Your SETU platform is now live! Share your URLs:
- **Frontend**: https://setu-platform.vercel.app
- **Backend API**: https://setu-backend.onrender.com

### Next Steps:
1. Set up custom domain (optional)
2. Configure email notifications
3. Set up monitoring/alerting
4. Regular backups of MongoDB

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs
3. Verify all environment variables
4. Ensure MongoDB whitelist includes `0.0.0.0/0`

---

**Note**: On Render's free tier, the backend sleeps after 15 minutes of inactivity. The first request after sleep will take ~30 seconds to wake up.
