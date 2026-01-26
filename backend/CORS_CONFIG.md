# CORS Configuration Guide

## Current Setup

The backend CORS is configured to allow only:
- Frontend URL (from `CLIENT_URL` env var)
- Admin Panel URL (from `ADMIN_URL` env var)

## Important Notes

### ✅ URL Format

**Correct:**
```bash
CLIENT_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

**Wrong:**
```bash
CLIENT_URL=https://your-frontend.vercel.app/  # ❌ No trailing slash
CLIENT_URL=http://your-frontend.vercel.app    # ❌ Must use https
CLIENT_URL=your-frontend.vercel.app           # ❌ Must include protocol
```

### ✅ Development

In development mode, localhost is automatically allowed:
- `http://localhost:3000` (frontend)
- `http://localhost:3001` (admin)
- `http://localhost:5173` (Vite dev server)

### ✅ Production

Only the exact URLs from environment variables are allowed.

## Testing CORS

If you see CORS errors:

1. **Check browser console** for the exact origin being blocked
2. **Verify environment variables** match exactly (case-sensitive)
3. **Check for trailing slashes** - remove them
4. **Verify HTTPS** - must use `https://` in production

## Common CORS Errors

### Error: "Not allowed by CORS"

**Cause:** Origin not in allowed list

**Fix:**
- Add exact origin to `CLIENT_URL` or `ADMIN_URL`
- Remove trailing slashes
- Ensure `https://` is used

### Error: "Credentials not allowed"

**Cause:** CORS credentials issue

**Fix:**
- Already configured with `credentials: true`
- Ensure frontend sends `credentials: 'include'` in fetch/axios

## Debugging

The backend logs blocked origins:
```
CORS blocked origin: https://unauthorized-domain.com
```

Check Render logs to see what origins are being blocked.
