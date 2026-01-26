import express from 'express';
import { authenticateAdmin, optionalAuthenticateAdmin } from '../middlewares/auth.middleware.js';
import {
  createJob,
  getAllJobs,
  getJobBySlug,
  updateJob,
  deleteJob,
} from '../controllers/job.controller.js';
import {
  submitApplication,
  getAllApplications,
  getApplicationsByJob,
  updateApplicationStatus,
} from '../controllers/jobApplication.controller.js';
import { uploadResume } from '../middlewares/upload.resumes.js';
import { validateObjectId } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuthenticateAdmin, getAllJobs);
router.get('/:slug', optionalAuthenticateAdmin, getJobBySlug);

// Public application submission
router.post('/apply', uploadResume, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required',
      });
    }
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    req.body.resumeUrl = resumeUrl;
    next();
  } catch (error) {
    next(error);
  }
}, submitApplication);

// Admin routes
router.post('/', authenticateAdmin, createJob);
router.put('/:id', authenticateAdmin, validateObjectId, updateJob);
router.delete('/:id', authenticateAdmin, validateObjectId, deleteJob);

export default router;
