# 🚀 GulfVista Marketplace - Cloud Deployment Guide

Your code is now pushed to GitHub. Follow these steps to deploy to Railway, Vercel, and Supabase.

---

## 📦 **Phase 1: Deploy Backend to Railway**

### Step 1: Connect Railway to GitHub
1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize and select your repo: `gulfvista-marketplace`
5. Select the `main` branch

### Step 2: Configure Backend Service
1. Add environment variables in Railway dashboard:
   ```
   DATABASE_URL=your_supabase_connection_string
   SECRET_KEY=your_secret_key
   REELLY_API_KEY=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
   DEBUG=false
   ```

2. Set **Root Directory** to `backend/`
3. Set **Start Command** to:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. Click **Deploy** and wait for completion

### Step 3: Get Backend URL
- Once deployed, Railway will provide a URL like: `https://gulfvista-api.up.railway.app`
- Copy this URL - you'll need it for frontend and Supabase

---

## 🎨 **Phase 2: Deploy Frontend to Vercel**

### Step 1: Connect Vercel to GitHub
1. Go to https://vercel.com
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Find and import: `gulfvista-marketplace`
5. Select `main` branch

### Step 2: Configure Build Settings
1. **Framework Preset**: Select "Vite"
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`
5. **Root Directory**: `frontend/`

### Step 3: Set Environment Variables
Add these in Vercel dashboard:

```
VITE_API_URL=https://gulfvista-api.up.railway.app
REACT_APP_API_URL=https://gulfvista-api.up.railway.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
```

### Step 4: Deploy
Click **Deploy** and wait. You'll get a URL like: `https://gulfvista-marketplace.vercel.app`

---

## 🗄️ **Phase 3: Setup Supabase Database**

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name**: gulfvista-marketplace
   - **Database Password**: Choose strong password (save it!)
   - **Region**: Choose closest to your users (UAE/Middle East)

### Step 2: Get Connection String
1. Go to **Settings → Database → Connection Pooling** (or Connection String)
2. Copy the **PostgreSQL URI** (looks like):
   ```
   postgresql://postgres:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
   ```

### Step 3: Update Railway Environment
1. Go back to Railway backend service
2. Update `DATABASE_URL` with the Supabase connection string
3. Redeploy

### Step 4: Run Database Migrations
In your Railway deployment, make sure to run:
```bash
alembic upgrade head
```

---

## 🔗 **Phase 4: Connect Services**

### Update API URL References
Make sure frontend uses the Railway backend URL:

**Frontend (.env.local)**:
```
VITE_API_URL=https://gulfvista-api.up.railway.app
```

### Test Connectivity
1. Visit Frontend: https://gulfvista-marketplace.vercel.app
2. Check API health: https://gulfvista-api.up.railway.app/health
3. Check API docs: https://gulfvista-api.up.railway.app/api/docs

---

## 📋 **Deployment Checklist**

- [ ] GitHub repo pushed with all code
- [ ] Railway backend deployed
- [ ] Database migrations run
- [ ] Vercel frontend deployed
- [ ] Environment variables configured
- [ ] API health check passes
- [ ] Frontend connects to backend
- [ ] Supabase project created
- [ ] Database backups enabled

---

## 🆘 **Troubleshooting**

### Backend won't start on Railway
- Check logs in Railway dashboard
- Verify `DATABASE_URL` is correct
- Ensure all environment variables are set
- Check if port is bound to $PORT variable

### Frontend can't reach backend
- Verify VITE_API_URL points to correct Railway URL
- Check CORS settings in backend (main.py)
- Use browser DevTools to see actual API calls

### Database connection fails
- Verify Supabase connection string format
- Check if connection pooling is enabled
- Ensure database password doesn't have special characters that need escaping

---

## 📞 **Need Help?**

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.io/docs

---

**Your app is now production-ready! 🎉**
