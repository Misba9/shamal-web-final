import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization header required.',
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
      }
      throw error;
    }

    // Find admin from database to ensure they still exist
    const admin = await Admin.findById(decoded.id).select('-password -__v');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found. Token is invalid.',
      });
    }

    // Attach admin info to request object (no sensitive data)
    req.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional admin auth: if valid Bearer JWT, sets req.admin; otherwise continues without 401.
 * Used for GET /api/projects and GET /api/blogs to show all when admin, or filtered when public.
 * We never call next(error) for invalid/missing decoded.id or findById CastError,
 * so the error handler cannot return 400 for this middleware.
 */
export const optionalAuthenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.substring(7);
    if (!token) return next();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next();
    }
    if (!decoded?.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return next();
    }

    let admin = null;
    try {
      admin = await Admin.findById(decoded.id).select('-password -__v');
    } catch (_) {
      // CastError or DB error: continue without admin, do not pass to error handler
      return next();
    }
    if (admin) {
      req.admin = { id: admin._id, email: admin.email, role: admin.role };
    }
    return next();
  } catch (error) {
    next(error);
  }
};
