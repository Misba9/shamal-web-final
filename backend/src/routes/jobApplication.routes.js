import express from 'express';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import {
  getAllApplications,
  getApplicationsByJob,
  updateApplicationStatus,
} from '../controllers/jobApplication.controller.js';
import { validateObjectId } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Admin application routes
router.get('/', authenticateAdmin, getAllApplications);
router.get('/job/:jobId', authenticateAdmin, getApplicationsByJob);
router.put('/:id', authenticateAdmin, validateObjectId, updateApplicationStatus);

export default router;
