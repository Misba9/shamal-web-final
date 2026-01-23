import express from 'express';
import { adminLogin } from '../controllers/auth.controller.js';
import { validate, validateLogin } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Admin authentication routes
router.post('/admin/login', validate(validateLogin), adminLogin);

export default router;
