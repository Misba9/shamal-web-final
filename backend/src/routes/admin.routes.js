import express from 'express';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { getDashboard } from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticateAdmin);

// Dashboard route
router.get('/dashboard', getDashboard);

// Projects, Blogs, Contacts, Newsletter use top-level /api/projects, /api/blogs, /api/contacts, /api/newsletter

export default router;
