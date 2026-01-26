# ✅ Vercel Deployment Checklists

## Frontend Deployment

### Pre-Deployment

- [ ] Backend deployed and URL obtained
- [ ] `.env.production` created (or use Vercel env vars)

### Vercel Setup

- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click "Add New..." → "Project"
- [ ] Import GitHub repository
- [ ] Select `forntend` folder

### Configuration

- [ ] **Framework Preset:** `Vite`
- [ ] **Root Directory:** `forntend`
- [ ] **Build Command:** `npm run build`
- [ ] **Output Directory:** `dist`
- [ ] **Install Command:** `npm install`

### Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

- [ ] `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

### Post-Deployment

- [ ] Deployment successful
- [ ] Visit frontend URL
- [ ] Check browser console for errors
- [ ] Test API calls (check Network tab)
- [ ] Update backend `CLIENT_URL` with frontend URL

---

## Admin Panel Deployment

### Pre-Deployment

- [ ] Backend deployed and URL obtained
- [ ] Frontend deployed (to get pattern)
- [ ] `.env.production` created (or use Vercel env vars)

### Vercel Setup

- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click "Add New..." → "Project" (NEW project, separate from frontend)
- [ ] Import same GitHub repository
- [ ] Select `admin` folder

### Configuration

- [ ] **Framework Preset:** `Vite`
- [ ] **Root Directory:** `admin`
- [ ] **Build Command:** `npm run build`
- [ ] **Output Directory:** `dist`
- [ ] **Install Command:** `npm install`

### Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

- [ ] `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

### Post-Deployment

- [ ] Deployment successful
- [ ] Visit admin URL
- [ ] Test login functionality
- [ ] Verify admin routes work
- [ ] Update backend `ADMIN_URL` with admin panel URL

---

## Common Issues

### Build Fails

- [ ] Check Node.js version (add to `package.json`: `"engines": { "node": "18.x" }`)
- [ ] Verify all dependencies in `package.json`
- [ ] Check build logs in Vercel dashboard

### API Calls Fail

- [ ] Verify `VITE_API_BASE_URL` is set correctly
- [ ] Check backend CORS includes your Vercel domain
- [ ] Check browser Network tab for actual request URL

### 404 on Refresh

- [ ] Verify `vercel.json` has rewrite rules (already included)
- [ ] Check SPA routing configuration

---

**Frontend URL:** `https://your-frontend.vercel.app`  
**Admin URL:** `https://your-admin.vercel.app`
