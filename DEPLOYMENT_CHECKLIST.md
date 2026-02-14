# ✅ Deployment Checklist

Complete this checklist to deploy your SETU platform successfully.

## 📋 Pre-Deployment

- [ ] All code is tested locally
- [ ] Frontend connects to backend successfully
- [ ] Database is accessible
- [ ] All features are working
- [ ] Environment variables are documented

## 🔐 Accounts Setup

- [ ] GitHub account created
- [ ] Render account created (https://render.com)
- [ ] Vercel account created (https://vercel.com)
- [ ] MongoDB Atlas configured

## 📤 Code Repository

- [ ] Initialize Git repository
  ```bash
  cd c:\Users\Administrator\SETU
  git init
  git add .
  git commit -m "Initial commit: SETU platform ready for deployment"
  ```

- [ ] Create GitHub repository
  - Go to https://github.com/new
  - Name: `setu-platform` (or your choice)
  - Keep it private or public
  - Don't initialize with README

- [ ] Push code to GitHub
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/setu-platform.git
  git branch -M main
  git push -u origin main
  ```

## 🖥️ Backend Deployment (Render)

- [ ] Go to https://render.com/dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure service:
  - Name: `setu-backend`
  - Region: `Singapore` or closest
  - Branch: `main`
  - Root Directory: `backend`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: `Free`

- [ ] Add Environment Variables:
  ```
  NODE_ENV=production
  MONGO_URI=mongodb+srv://ludhiyaniharsha_db_user:XqMHAji2fe020yMA@cluster0.jlditfa.mongodb.net/?appName=Cluster0
  JWT_SECRET=setu_super_secret_production_key_2026_change_this
  JWT_EXPIRE=7d
  PORT=10000
  ```

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy backend URL: `https://setu-backend-XXXX.onrender.com`
- [ ] Test backend: Visit URL in browser (should show "Setu Backend Running Successfully!")

## 🌐 Frontend Deployment (Vercel)

- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository
- [ ] Configure project:
  - Framework Preset: `Vite`
  - Root Directory: `frontend`
  - Build Command: `npm run build` (auto-detected)
  - Output Directory: `dist` (auto-detected)
  - Install Command: `npm install` (auto-detected)

- [ ] Add Environment Variable:
  - Name: `VITE_API_URL`
  - Value: `https://setu-backend-XXXX.onrender.com` (your backend URL)

- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy frontend URL: `https://setu-platform-XXXX.vercel.app`

## 🔄 Update CORS

- [ ] Go to Render Dashboard
- [ ] Select your backend service
- [ ] Go to "Environment"
- [ ] Add new variable:
  - Name: `FRONTEND_URL`
  - Value: `https://setu-platform-XXXX.vercel.app` (your Vercel URL)
- [ ] Save changes
- [ ] Service will auto-redeploy

## 🗄️ Database Configuration

- [ ] Go to MongoDB Atlas (https://cloud.mongodb.com)
- [ ] Select your cluster
- [ ] Click "Network Access" (left sidebar)
- [ ] Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
- [ ] Click "Confirm"

## ✅ Testing

- [ ] Visit frontend URL
- [ ] Landing page loads correctly
- [ ] Navigate through pages (no 404 errors)
- [ ] Test registration:
  - Customer registration works
  - Agency registration works
- [ ] Test login:
  - Customer login works
  - Agency login works
  - Admin login works (admin@setu.com / admin123)
- [ ] Test product features:
  - Browse products visible
  - Product detail page works
  - Search functionality works
- [ ] Test admin features:
  - Admin dashboard loads
  - Can view pending products
  - Can approve/reject products
  - Analytics display correctly
- [ ] Test agency features:
  - Agency dashboard loads
  - Can add products
  - Products go to pending status
- [ ] Test customer features:
  - Can add items to watchlist
  - Can place orders
  - Order history visible

## 🔍 Troubleshooting

If something doesn't work:

### Backend Issues
- [ ] Check Render logs: Dashboard → Service → Logs
- [ ] Verify all environment variables are set
- [ ] Check MongoDB connection (Network Access whitelist)
- [ ] Wait 30 seconds for cold start (free tier)

### Frontend Issues
- [ ] Check Vercel logs: Dashboard → Project → Deployments
- [ ] Verify `VITE_API_URL` is correct
- [ ] Check browser console for errors
- [ ] Verify backend is accessible

### API Connection Issues
- [ ] Verify CORS is configured with correct frontend URL
- [ ] Check backend URL is correct in frontend env
- [ ] Test backend endpoint directly in browser
- [ ] Check browser network tab for failed requests

## 📝 Post-Deployment

- [ ] Change admin password from default
- [ ] Create admin user seed if not already done:
  ```bash
  # Connect to your Render shell and run:
  node scripts/seedAdmin.js
  ```
- [ ] Document your deployment URLs
  - Frontend: ________________
  - Backend: ________________
- [ ] Share URLs with team/users
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up backup strategy

## 🎉 Success!

If all checkboxes are marked, your SETU platform is successfully deployed!

### Your Live URLs:
- **Frontend**: https://setu-platform-XXXX.vercel.app
- **Backend**: https://setu-backend-XXXX.onrender.com
- **Admin Panel**: https://setu-platform-XXXX.vercel.app/login/admin

### Default Admin Login:
- Email: admin@setu.com
- Password: admin123
- ⚠️ Change this immediately!

## 📞 Need Help?

Refer to:
1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed instructions
2. [README.md](./README.md) - Project documentation
3. Render documentation: https://render.com/docs
4. Vercel documentation: https://vercel.com/docs

---

**Deployment Date**: ____________
**Deployed By**: ____________
**Notes**: ____________
