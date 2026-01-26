# 🚀 Production Deployment Guide

Complete step-by-step guide to deploy Frontend, Admin Panel, and Backend to production.

---

## 📋 Prerequisites

- [x] MongoDB Atlas account (free tier)
- [x] Render account (free tier)
- [x] Vercel account (free tier)
- [x] Git repository (GitHub recommended)

---

## 1️⃣ Backend Deployment (Render)

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user (username/password)
4. Whitelist IP: `0.0.0.0/0` (allows all IPs - required for Render)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### Step 2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `backend` folder (or root if backend is at root)

**Render Configuration:**

| Setting | Value |
|---------|-------|
| **Name** | `shamal-backend` (or your choice) |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

**Environment Variables (Add in Render Dashboard):**

```bash
NODE_ENV=production
PORT=10000
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
CLIENT_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

**Important Notes:**
- Render uses port `10000` by default (or `PORT` env var)
- Free tier services spin down after 15min inactivity (first request may be slow)
- Health check: Render will ping `/api/health` automatically

### Step 3: Verify Backend

After deployment, test:
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-01-26T..."}
```

**Backend URL:** `https://your-backend.onrender.com`

---

## 2️⃣ Frontend Deployment (Vercel)

### Step 1: Prepare Environment

1. **Create `.env.production` in `forntend/` folder:**
   ```bash
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

2. **Verify `package.json` has build script:**
   ```json
   {
     "scripts": {
       "build": "vite build"
     }
   }
   ```

### Step 2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the `forntend` folder

**Vercel Configuration:**

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `forntend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

**Environment Variables (Add in Vercel Dashboard):**

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Step 3: Verify Frontend

- Visit your Vercel URL
- Check browser console for API errors
- Test navigation and API calls

**Frontend URL:** `https://your-frontend.vercel.app`

---

## 3️⃣ Admin Panel Deployment (Vercel)

### Step 1: Prepare Environment

1. **Create `.env.production` in `admin/` folder:**
   ```bash
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

### Step 2: Deploy to Vercel

1. **Create a NEW Vercel project** (separate from frontend)
2. Import the same GitHub repository
3. Select the `admin` folder

**Vercel Configuration:**

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `admin` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

**Environment Variables:**

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Step 3: Update Backend CORS

After getting admin URL, update backend environment variable:

**In Render Dashboard → Environment Variables:**
```bash
ADMIN_URL=https://your-admin.vercel.app
```

**Admin Panel URL:** `https://your-admin.vercel.app`

---

## 4️⃣ Security & Production Checklist

### ✅ Backend Security

- [x] **CORS configured** - Only frontend and admin URLs allowed
- [x] **Rate limiting** - 100 requests per 15min per IP
- [x] **Error handling** - No stack traces in production
- [x] **Environment variables** - All secrets in Render dashboard
- [x] **File upload validation** - PDF/DOC/DOCX for resumes, images for others
- [x] **JWT secret** - Strong random string (min 32 chars)

### ✅ Frontend Security

- [x] **No secrets in code** - All API URLs in environment variables
- [x] **Production build** - No source maps in production
- [x] **HTTPS only** - Vercel enforces HTTPS

### ✅ Admin Panel Security

- [x] **JWT authentication** - All routes protected
- [x] **Separate deployment** - Isolated from public frontend
- [x] **No public access** - Login required

---

## 5️⃣ Environment Variables Summary

### Backend (Render)

```bash
NODE_ENV=production
PORT=10000
DB_URL=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

### Frontend (Vercel)

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Admin Panel (Vercel)

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## 6️⃣ Common Production Errors & Fixes

### ❌ Error: "CORS policy blocked"

**Fix:**
- Check `CLIENT_URL` and `ADMIN_URL` in backend (no trailing slashes)
- Ensure URLs match exactly (including `https://`)
- Check browser console for exact origin being blocked

### ❌ Error: "MongoDB connection failed"

**Fix:**
- Verify `DB_URL` is correct in Render
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### ❌ Error: "API calls failing"

**Fix:**
- Verify `VITE_API_BASE_URL` in Vercel environment variables
- Check backend is running (Render free tier may be sleeping)
- Check browser network tab for actual request URLs

### ❌ Error: "File uploads not working"

**Fix:**
- Render free tier has limited storage - consider using cloud storage (S3, Cloudinary)
- Verify file size limits (5MB for resumes, 2MB for images)
- Check file type validation

### ❌ Error: "Render service sleeping"

**Fix:**
- Free tier services sleep after 15min inactivity
- First request after sleep takes ~30s to wake up
- Consider upgrading to paid plan for always-on service

### ❌ Error: "Build fails on Vercel"

**Fix:**
- Check Node.js version in `package.json` (add `"engines": { "node": "18.x" }`)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

---

## 7️⃣ Post-Deployment Verification

### ✅ Backend Tests

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Test API
curl https://your-backend.onrender.com/api/projects
```

### ✅ Frontend Tests

- [ ] Homepage loads
- [ ] Navigation works
- [ ] API calls succeed (check Network tab)
- [ ] Images load correctly
- [ ] Forms submit successfully

### ✅ Admin Panel Tests

- [ ] Login works
- [ ] Dashboard loads
- [ ] CRUD operations work
- [ ] File uploads work
- [ ] Applications visible

### ✅ Security Tests

- [ ] CORS blocks unauthorized origins
- [ ] Admin routes require authentication
- [ ] No secrets in browser console
- [ ] HTTPS enforced

---

## 8️⃣ Monitoring & Maintenance

### Render Monitoring

- Check Render dashboard for service status
- Monitor logs for errors
- Set up email alerts for service failures

### Vercel Monitoring

- Check Vercel dashboard for build status
- Monitor analytics for traffic
- Set up deployment notifications

### MongoDB Monitoring

- Monitor Atlas dashboard for connection issues
- Set up alerts for high usage
- Regular backup (Atlas free tier includes backups)

---

## 9️⃣ Quick Reference Commands

### Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd forntend
npm install
npm run dev

# Admin
cd admin
npm install
npm run dev
```

### Production Builds

```bash
# Backend (Render handles this)
npm start

# Frontend
cd forntend
npm run build

# Admin
cd admin
npm run build
```

---

## 🔟 Final URLs Checklist

After deployment, you should have:

- ✅ **Backend API:** `https://your-backend.onrender.com`
- ✅ **Frontend:** `https://your-frontend.vercel.app`
- ✅ **Admin Panel:** `https://your-admin.vercel.app`

Update these URLs in:
1. Backend CORS settings (Render environment variables)
2. Frontend `.env.production` (Vercel environment variables)
3. Admin `.env.production` (Vercel environment variables)

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ All three services are live and accessible
- ✅ Frontend can communicate with backend
- ✅ Admin panel can login and manage content
- ✅ File uploads work (resumes, images)
- ✅ No CORS errors in browser console
- ✅ No secrets exposed in client-side code
- ✅ HTTPS enforced on all domains

---

## 📞 Support

If you encounter issues:

1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Logs
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

---

**Last Updated:** January 26, 2026
