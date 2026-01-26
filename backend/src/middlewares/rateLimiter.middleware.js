/**
 * Rate limiting middleware for production
 * Prevents abuse and DDoS attacks
 */

// Simple in-memory rate limiter (for production, consider Redis)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window per IP

export const rateLimiter = (req, res, next) => {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Clean old entries
  if (requestCounts.size > 10000) {
    const cutoff = now - RATE_LIMIT_WINDOW;
    for (const [key, value] of requestCounts.entries()) {
      if (value.timestamp < cutoff) {
        requestCounts.delete(key);
      }
    }
  }

  const key = `${ip}-${Math.floor(now / RATE_LIMIT_WINDOW)}`;
  const current = requestCounts.get(key) || { count: 0, timestamp: now };

  if (current.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  }

  current.count++;
  requestCounts.set(key, current);

  next();
};
