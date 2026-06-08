# ✅ DEPLOYMENT VERIFICATION CHECKLIST

**Last Updated:** June 8, 2026  
**Status:** Critical - Deployments Failing

---

## 🔴 CRITICAL: Deployment Failure Diagnosis

### The Problem
✗ Deployments to Render and Vercel are failing  
✓ Code is on GitHub  
✓ Docker locally working  
? Exact error messages needed

---

## 📋 STEP 1: Verify Local Setup First

Before deploying to cloud, test everything locally:

### Backend Local Test
```bash
cd backend

# Check Python version
python --version
# Expected: Python 3.13.x

# Test imports
python -c "import fastapi; import uvicorn; print('✓ Dependencies installed')"

# Check .env file exists
test -f .env && echo "✓ .env file found" || echo "✗ .env MISSING"

# Check requirements
test -f requirements.txt && echo "✓ requirements.txt found" || echo "✗ MISSING"

# Try starting server
python -m uvicorn main:app --host 0.0.0.0 --port 8000
# Should show: Uvicorn running on http://0.0.0.0:8000
# Press Ctrl+C to stop
```

**✅ If all above pass → Proceed to Step 2**

### Frontend Local Test
```bash
cd frontend

# Check Node version
node --version npm --version
# Expected: Node 20+, npm 11+

# Check files
test -f package.json && echo "✓ package.json found" || echo "✗ MISSING"
test -d node_modules && echo "✓ Dependencies installed" || echo "✗ Need: npm install"

# Try starting dev server
npm run dev
# Should show: VITE v5.4.21 ready in ... ms
# Press Ctrl+C to stop
```

**✅ If all above pass → Proceed to Step 2**

---

## 🗄️ STEP 2: Supabase Database Setup

### Create Supabase Project

**CRITICAL:** This MUST be done before Render deployment!

1. Go to https://supabase.com
2. Sign up/Login with GitHub
3. Click **"Create a new project"**

**REQUIRED SETTINGS:**
```
Organization: Create new (or select existing)
Project Name: gulfvista-marketplace
Database Password: SuperStrong@Pass123
(Save this password!)
Region: USD or Singapore
Pricing: Free
```

4. **Wait 2-3 minutes** for database initialization
5. Go to **Settings** (bottom left) → **Database**
6. Click **"Connection Pooling"** tab

**GET CONNECTION STRING:**
```
Look for "PostgreSQL" section
Copy the URI shown (format):
postgresql://postgres:PASSWORD@aws-0-0-1-region.pooler.supabase.com:6543/postgres
```

**⭐ VERIFY CONNECTION STRING FORMAT:**
```
✓ Starts with: postgresql://
✓ Has username: postgres
✓ Has password: (the one you set)
✓ Has host: ...supabase.com
✓ Port is: 6543 (NOT 5432!)
✓ Database: postgres (default)
```

**TEST CONNECTION LOCALLY:**
```bash
# Install psql if needed, then test
psql "postgresql://postgres:YOUR_PASSWORD@aws-0-0-1-region.pooler.supabase.com:6543/postgres" -c "SELECT 1;"

# Expected output:
# ?column?
# --------
# 1
```

**✅ If connection works → Proceed to Step 3**

---

## 🚂 STEP 3: Deploy to Render (CORRECTLY)

### Critical Render Configuration

1. Go to https://render.com
2. Login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Click **"Deploy an existing repository"**
5. Find and select: **gulfvista-marketplace**
6. Click **"Connect"**

### ⚠️ EXACT CONFIGURATION NEEDED:

```
===== DEPLOYMENT SETTINGS =====
Name:              gulfvista-api
Environment:       Python 3
Region:            Frankfurt (EU)
Branch:            main
Root Directory:    backend        <-- CRITICAL!
Build Command:     pip install -r requirements.txt && alembic upgrade head
Start Command:     uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type:     Free
Auto-deploy:       ON
```

### ⚠️ ENVIRONMENT VARIABLES (ADD IN "Advanced" SECTION):

**Click "Advanced" → "Add Environment Variable"** for each:

**1️⃣ DATABASE_URL** (MOST IMPORTANT!)
```
Key:   DATABASE_URL
Value: postgresql://postgres:PASSWORD@aws-0-0-1-region.pooler.supabase.com:6543/postgres
```
*(Replace PASSWORD with your actual password)*

**2️⃣ SECRET_KEY**
```
Key:   SECRET_KEY
Value: your-super-secret-production-key-12345-change-this
```

**3️⃣ REELLY_API_KEY**
```
Key:   REELLY_API_KEY
Value: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfbmFtZSI6IkomTCBFbGVjdHJpY2FscyJ9.ST66NkxEMLWmffaUPW6Pj8S7h1rXUzigbzWipEi8t7TgKe7S4dwD5gdv8eADH8pYvFMGONdyHnyw_7cqCEsLPA
```

**4️⃣ DEBUG**
```
Key:   DEBUG
Value: false
```

**5️⃣ CORS_ORIGINS**
```
Key:   CORS_ORIGINS
Value: ["https://gulfvista-marketplace.vercel.app","http://localhost:5173"]
```

### ✅ VERIFY EACH VARIABLE WAS ADDED

After adding all 5 variables, you should see them listed above "Create Web Service" button.

### 🚀 CLICK "Create Web Service"

Render will now:
1. Build the application
2. Run: `pip install -r requirements.txt`
3. Run: `alembic upgrade head` (database migrations)
4. Start the server

**⏱️ WAIT 5-10 MINUTES** for deployment

### ✅ CHECK RENDER DEPLOYMENT STATUS

**Look for these signs in Logs:**
```
✓ Build started
✓ Installing dependencies...
✓ Running migrations... (alembic upgrade head)
✓ Starting server...
✓ Uvicorn running on...
✓ Application startup complete
```

**❌ COMMON ERRORS & FIXES:**

| Error | Cause | Fix |
|-------|-------|-----|
| `could not connect to database` | Wrong DATABASE_URL | Verify Supabase connection string, test locally first |
| `module not found` | Missing dependency | Check requirements.txt has all packages |
| `alembic: command not found` | alembic not installed | Add to requirements.txt |
| `port already in use` | Another process using port | Render uses $PORT variable, shouldn't conflict |

### ✅ GET YOUR RENDER URL

Once deployment says "Live", look at the top for your service URL:
```
Format: https://gulfvista-api.onrender.com
(Your actual name may differ slightly)
```

**⭐ COPY THIS URL** - you need it for Vercel!

### ✅ TEST RENDER BACKEND

```bash
# Test health endpoint
curl https://your-render-url/health
# Expected response: {"status":"ok"}

# Test API is up
curl https://your-render-url/api/properties
# Should return JSON array of properties

# Test API docs load
Visit: https://your-render-url/api/docs
# Should show Swagger UI
```

**✅ If all tests pass → Proceed to Step 4**

---

## 🎨 STEP 4: Deploy to Vercel

### Vercel Configuration

1. Go to https://vercel.com
2. Login with GitHub
3. Click **"Add New"** → **"Project"**
4. Click **"Import Git Repository"**
5. Search for: **gulfvista-marketplace**
6. Click **"Import"**

### ⚠️ EXACT CONFIGURATION NEEDED:

**On Import Screen:**
```
===== BUILD SETTINGS =====
Framework:         Vite
Root Directory:    frontend      <-- CRITICAL!
Build Command:     npm run build
Output Directory:  dist
Install Command:   npm install
```

### ⚠️ ENVIRONMENT VARIABLES:

Click **"Environment Variables"** and add:

**1️⃣ VITE_API_URL**
```
Key:   VITE_API_URL
Value: https://your-render-url
```
*(Use your actual Render URL from Step 3)*

**2️⃣ REACT_APP_API_URL**
```
Key:   REACT_APP_API_URL
Value: https://your-render-url
```
*(Same as above)*

**3️⃣ REACT_APP_STRIPE_PUBLISHABLE_KEY** (optional for now)
```
Key:   REACT_APP_STRIPE_PUBLISHABLE_KEY
Value: pk_test_your_key_here
```

### 🚀 CLICK "Deploy"

Vercel will:
1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Deploy to CDN

**⏱️ WAIT 3-5 MINUTES** for build & deployment

### ✅ VERIFY VERCEL DEPLOYMENT

Once "Deployment Success" appears:

1. **Copy your Vercel URL:**
   ```
   Format: https://gulfvista-marketplace.vercel.app
   (Your actual URL shown in deployment)
   ```

2. **Visit your frontend:**
   ```
   https://your-vercel-url
   ```
   Should load without errors

3. **Check console for errors (F12):**
   - Open Developer Tools (F12)
   - Go to "Console" tab
   - Should see NO red errors
   - May see warnings (ok)

**✅ If frontend loads → Proceed to Step 5**

---

## 🧪 STEP 5: Test Full Integration

### 1️⃣ Test Render Backend Directly

```bash
# In browser or terminal:

# Health check
curl https://your-render-url/health

# Get properties
curl https://your-render-url/api/properties

# API docs
https://your-render-url/api/docs
```

**✅ All should respond with data**

### 2️⃣ Test Frontend Can Reach Backend

**In browser:**
1. Visit: https://your-vercel-url
2. Open DevTools (F12)
3. Go to "Network" tab
4. Reload page
5. Look for requests to `/api/properties` or similar
6. Should see: Status **200** (not 404, 500, CORS errors)

**✅ If network requests succeed → Integration working!**

### 3️⃣ Test Application Features

- [ ] Page loads without errors
- [ ] Can see properties list
- [ ] Can click on property details
- [ ] Search/filters work (if implemented)
- [ ] No console errors

---

## 📊 FINAL VERIFICATION CHECKLIST

Use this to confirm everything is ready:

### Supabase
- [ ] Project created
- [ ] Connection string copied and verified
- [ ] Connection tested locally with psql
- [ ] Region set to UAE/Singapore

### Render Backend
- [ ] Code deployed successfully
- [ ] All 5 environment variables set
- [ ] Root Directory set to `backend/`
- [ ] Build Command includes alembic migrations
- [ ] Service shows "Live"
- [ ] Health endpoint responds with 200
- [ ] API docs load at /api/docs
- [ ] Can fetch /api/properties

### Vercel Frontend
- [ ] Code deployed successfully
- [ ] Root Directory set to `frontend/`
- [ ] Both API URL variables set to Render URL
- [ ] Build succeeded
- [ ] Page loads without errors
- [ ] No 404 or CORS errors in console
- [ ] Network requests go to Render (not localhost)

### Integration
- [ ] Frontend and Backend both "Live"
- [ ] Frontend can communicate with backend
- [ ] No CORS errors in console
- [ ] Data loads on frontend
- [ ] Application functions as expected

---

## 🆘 IF SOMETHING STILL FAILS

### 1. Check Render Logs
```
Render Dashboard → Your Service → Logs
Look for:
- Build errors
- Database connection errors
- Startup errors
```

### 2. Check Vercel Logs
```
Vercel Dashboard → Your Project → Deployments → Details
Look for:
- Build errors
- Install errors
- Environment variable issues
```

### 3. Check Browser Console (F12)
```
Network Tab:
- Any failed requests?
- CORS errors?
- 404s or 500s?

Console Tab:
- Red error messages?
- Unresolved promises?
```

### 4. Test Database Locally
```bash
# Verify Supabase connection works on your machine
psql "your-connection-string"
# If this fails, connection string is wrong
```

### 5. Enable Debug Mode (Temporary)

In Render environment variables, set:
```
DEBUG = true
```

This will show more detailed error messages in logs.

---

## 📞 SUPPORT

**If deployment still fails:**

1. **Check Render logs** for exact error message
2. **Check Vercel logs** for build/runtime errors
3. **Verify each environment variable** is exactly correct
4. **Test DATABASE_URL** locally with psql
5. **Confirm Root Directories** are correct (backend/ and frontend/)

**Common Issues:**
- Wrong DATABASE_URL format → Test with psql locally
- Port 6543 vs 5432 → Supabase pooling uses 6543
- CORS errors → Check CORS_ORIGINS includes Vercel URL
- Build errors → Check all dependencies in requirements.txt

---

**Once all green checks (✅) are complete, your app is LIVE! 🎉**
