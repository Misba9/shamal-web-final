# 🔐 Production Environment Variables

Complete list of all environment variables needed for production deployment.

---

## Backend (Render)

### Required Variables

```bash
# Server
NODE_ENV=production
PORT=10000

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# CORS (no trailing slashes)
CLIENT_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

### Optional Variables

```bash
# Admin Seed (for initial admin creation)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password-123
```

---

## Frontend (Vercel)

### Required Variables

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

**Note:** 
- Must include `/api` at the end
- No trailing slash
- Use `https://` (not `http://`)

---

## Admin Panel (Vercel)

### Required Variables

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

**Note:**
- Same as frontend
- Separate Vercel project
- Same API base URL

---

## Environment Variable Setup

### Render (Backend)

1. Go to Render Dashboard
2. Select your service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable one by one
6. Click "Save Changes"
7. Service will restart automatically

### Vercel (Frontend & Admin)

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Click "Add New"
5. Add variable name and value
6. Select "Production" environment
7. Click "Save"
8. Redeploy if needed

---

## Security Best Practices

### ✅ DO

- Use strong, random JWT_SECRET (min 32 characters)
- Use MongoDB Atlas connection string with credentials
- Keep all secrets in platform environment variables (never commit)
- Use HTTPS URLs only
- Remove trailing slashes from URLs

### ❌ DON'T

- Commit `.env` files to Git
- Use weak passwords or secrets
- Hard-code URLs in source code
- Expose secrets in client-side code
- Use `http://` in production

---

## Verification

After setting all variables:

1. **Backend:** Check logs for successful MongoDB connection
2. **Frontend:** Check browser console for API errors
3. **Admin:** Test login and API calls

---

## Quick Copy-Paste Template

### Backend (Render)

```bash
NODE_ENV=production
PORT=10000
DB_URL=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
CLIENT_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

### Frontend (Vercel)

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Admin (Vercel)

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

**Remember:** Update `CLIENT_URL` and `ADMIN_URL` in backend after deploying frontend and admin!
