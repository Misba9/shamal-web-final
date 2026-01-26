# ✅ Render Deployment Checklist

## Pre-Deployment

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with username/password
- [ ] IP whitelist set to `0.0.0.0/0` (allows all IPs)
- [ ] Connection string copied
- [ ] Strong JWT_SECRET generated (min 32 characters)

## Render Setup

- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select `backend` folder (or root if backend is at root)

## Configuration

- [ ] **Name:** `shamal-backend` (or your choice)
- [ ] **Environment:** `Node`
- [ ] **Region:** Choose closest to your users
- [ ] **Branch:** `main` (or your production branch)
- [ ] **Root Directory:** `backend` (if backend is in subfolder)
- [ ] **Build Command:** `npm install`
- [ ] **Start Command:** `npm start`
- [ ] **Plan:** `Free` (or upgrade for always-on)

## Environment Variables

Add these in Render Dashboard → Environment:

- [ ] `NODE_ENV=production`
- [ ] `PORT=10000` (Render default, or leave empty)
- [ ] `DB_URL=mongodb+srv://...` (your MongoDB connection string)
- [ ] `JWT_SECRET=your-strong-secret-key-here`
- [ ] `CLIENT_URL=https://your-frontend.vercel.app` (update after frontend deploy)
- [ ] `ADMIN_URL=https://your-admin.vercel.app` (update after admin deploy)

## Post-Deployment

- [ ] Service deployed successfully
- [ ] Health check passes: `curl https://your-backend.onrender.com/api/health`
- [ ] Test API endpoint: `curl https://your-backend.onrender.com/api/projects`
- [ ] Check logs for errors
- [ ] Update CORS URLs after frontend/admin deployment

## Notes

- Free tier services sleep after 15min inactivity
- First request after sleep takes ~30s (cold start)
- Consider upgrading to paid plan for always-on service
- Health check route: `/api/health` (used by Render)

---

**Backend URL:** `https://your-backend.onrender.com`
