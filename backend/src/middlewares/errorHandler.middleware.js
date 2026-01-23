// Central Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: isDevelopment ? errors : undefined,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Multer errors (file size, count, type)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max 5MB per image.' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ success: false, message: 'Too many files. Max 50 images.' });
  }
  if (err.message && /only.*(jpeg|jpg|png|webp)/i.test(err.message)) {
    return res.status(400).json({ success: false, message: 'Only jpg, png, jpeg, and webp images are allowed.' });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log error details server-side only
  if (statusCode === 500) {
    // Use proper logging instead of console.error
    if (isDevelopment) {
      console.error('Error:', err);
    }
    // In production, log to file/service
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && !isDevelopment 
      ? 'Internal server error' 
      : message,
    ...(isDevelopment && { stack: err.stack }),
  });
};

// 404 Handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
