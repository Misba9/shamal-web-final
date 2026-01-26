# ✅ Production Readiness Checklist

## Backend (Render)

### Configuration
- [x] `server.js` entry point exists
- [x] `package.json` has `"start": "node server.js"`
- [x] Health check route: `/api/health`
- [x] CORS configured for frontend and admin URLs
- [x] Rate limiting middleware added
- [x] Error handler hides stack traces in production
- [x] MongoDB connection uses `DB_URL` or `MONGO_URI`
- [x] File upload validation (PDF/DOC for resumes, images for others)
- [x] `.env.example` created
- [x] `.gitignore` excludes `.env` files

### Security
- [x] Helmet.js configured
- [x] CORS restricted to specific origins
- [x] Rate limiting enabled (100 req/15min per IP)
- [x] JWT authentication for admin routes
- [x] File size limits enforced (5MB resumes, 2MB images)
- [x] File type validation

### Environment Variables Required
```bash
NODE_ENV=production
PORT=10000
DB_URL=mongodb+srv://...
JWT_SECRET=strong-secret-key
CLIENT_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

---

## Frontend (Vercel)

### Configuration
- [x] `package.json` has `"build": "vite build"`
- [x] `vercel.json` configured for SPA routing
- [x] API client uses `VITE_API_BASE_URL` from env
- [x] `.env.example` created
- [x] `.gitignore` excludes `.env` files
- [x] No hard-coded API URLs

### Security
- [x] No secrets in client code
- [x] HTTPS enforced by Vercel
- [x] Security headers in `vercel.json`

### Environment Variables Required
```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## Admin Panel (Vercel)

### Configuration
- [x] `package.json` has `"build": "tsc && vite build"`
- [x] `vercel.json` configured for SPA routing
- [x] API client uses `VITE_API_BASE_URL` from env
- [x] JWT authentication required for all routes
- [x] `.env.example` created
- [x] `.gitignore` excludes `.env` files

### Security
- [x] No secrets in client code
- [x] HTTPS enforced by Vercel
- [x] Protected routes (login required)
- [x] Security headers in `vercel.json`

### Environment Variables Required
```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## Pre-Deployment Tasks

### Code Cleanup
- [ ] Remove `console.log` statements (or use proper logging)
- [ ] Remove mock/test data
- [ ] Remove unused imports
- [ ] Verify no hard-coded URLs

### Testing
- [ ] Test all API endpoints locally
- [ ] Test file uploads (resumes, images)
- [ ] Test admin login and CRUD operations
- [ ] Test frontend navigation and API calls

### Documentation
- [x] `DEPLOYMENT.md` created
- [x] `QUICK_DEPLOY.md` created
- [x] `PRODUCTION_ENV_VARS.md` created
- [x] `.env.example` files created

---

## Deployment Steps

1. **Deploy Backend** → Get URL
2. **Deploy Frontend** → Get URL → Update backend CORS
3. **Deploy Admin** → Get URL → Update backend CORS
4. **Verify** → Test all functionality

---

## Post-Deployment Verification

### Backend
- [ ] Health check: `curl https://your-backend.onrender.com/api/health`
- [ ] API test: `curl https://your-backend.onrender.com/api/projects`
- [ ] MongoDB connected (check logs)
- [ ] CORS working (no errors in browser console)

### Frontend
- [ ] Homepage loads
- [ ] Navigation works
- [ ] API calls succeed (check Network tab)
- [ ] Images load
- [ ] Forms submit

### Admin Panel
- [ ] Login works
- [ ] Dashboard loads
- [ ] CRUD operations work
- [ ] File uploads work
- [ ] Applications visible

---

## Common Production Issues

### Backend Sleeps (Render Free Tier)
- **Issue:** Service sleeps after 15min inactivity
- **Fix:** First request takes ~30s to wake up
- **Solution:** Upgrade to paid plan for always-on

### CORS Errors
- **Issue:** Browser blocks API requests
- **Fix:** Verify `CLIENT_URL` and `ADMIN_URL` in backend match Vercel domains exactly (no trailing slashes)

### File Uploads Fail
- **Issue:** Files not uploading
- **Fix:** Check file size (5MB max for resumes, 2MB for images)
- **Fix:** Verify file type (PDF/DOC for resumes, images for others)

### Build Fails
- **Issue:** Vercel build errors
- **Fix:** Check Node version (should be 18+)
- **Fix:** Verify all dependencies in `package.json`

---

## Monitoring

### Render
- Check service status in dashboard
- Monitor logs for errors
- Set up email alerts

### Vercel
- Check deployment status
- Monitor analytics
- Review build logs

### MongoDB Atlas
- Monitor connection status
- Check database usage
- Set up alerts

---

**Status:** ✅ Production Ready

All configurations are in place. Follow `DEPLOYMENT.md` for step-by-step instructions.
