# ⚡ Quick Deployment Guide

**TL;DR:** Deploy backend to Render, frontend & admin to Vercel.

---

## 🎯 Deployment Order

1. **Backend** → Render (get API URL)
2. **Frontend** → Vercel (update backend CORS)
3. **Admin** → Vercel (update backend CORS)

---

## 1️⃣ Backend (5 minutes)

### Render Setup

1. Go to [Render](https://dashboard.render.com) → New Web Service
2. Connect GitHub repo → Select `backend` folder
3. **Settings:**
   - Build: `npm install`
   - Start: `npm start`
   - Plan: Free

4. **Environment Variables:**
   ```bash
   NODE_ENV=production
   DB_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
   JWT_SECRET=your-32-char-secret-key
   CLIENT_URL=https://your-frontend.vercel.app  # Update after step 2
   ADMIN_URL=https://your-admin.vercel.app      # Update after step 3
   ```

5. **Deploy** → Copy URL: `https://your-backend.onrender.com`

---

## 2️⃣ Frontend (3 minutes)

### Vercel Setup

1. Go to [Vercel](https://vercel.com) → Add Project
2. Import repo → Select `forntend` folder
3. **Environment Variable:**
   ```bash
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy** → Copy URL: `https://your-frontend.vercel.app`

5. **Update Backend CORS:**
   - Go back to Render → Environment
   - Update `CLIENT_URL` with frontend URL

---

## 3️⃣ Admin Panel (3 minutes)

### Vercel Setup

1. Go to [Vercel](https://vercel.com) → Add Project (NEW project)
2. Import same repo → Select `admin` folder
3. **Environment Variable:**
   ```bash
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy** → Copy URL: `https://your-admin.vercel.app`

5. **Update Backend CORS:**
   - Go back to Render → Environment
   - Update `ADMIN_URL` with admin URL

---

## ✅ Verify

```bash
# Backend
curl https://your-backend.onrender.com/api/health

# Frontend
# Visit: https://your-frontend.vercel.app

# Admin
# Visit: https://your-admin.vercel.app → Login
```

---

## 🔧 Troubleshooting

**CORS Error?**
- Check URLs in backend have no trailing slashes
- Verify `CLIENT_URL` and `ADMIN_URL` match Vercel domains exactly

**API Not Working?**
- Check `VITE_API_BASE_URL` includes `/api` at end
- Verify backend is awake (free tier sleeps after 15min)

**Build Fails?**
- Check Node version (should be 18+)
- Verify all dependencies in `package.json`

---

**Full Guide:** See `DEPLOYMENT.md` for detailed instructions.
