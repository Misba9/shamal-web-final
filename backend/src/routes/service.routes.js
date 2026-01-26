import express from 'express';
import { authenticateAdmin, optionalAuthenticateAdmin } from '../middlewares/auth.middleware.js';
import {
  createService,
  getAllServices,
  getHomeServices,
  getServiceBySlug,
  updateService,
  deleteService,
  handleUploadServiceImage,
} from '../controllers/service.controller.js';
import { uploadServiceImage } from '../middlewares/upload.services.js';
import { validateObjectId } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Public routes
router.get('/home', getHomeServices); // Special route for home page - only active services with showOnHome = true
router.get('/', optionalAuthenticateAdmin, getAllServices);
router.get('/:slug', optionalAuthenticateAdmin, getServiceBySlug);

// Admin routes
router.post('/', authenticateAdmin, createService);
router.post('/upload-image', authenticateAdmin, uploadServiceImage, handleUploadServiceImage);
router.put('/:id', authenticateAdmin, validateObjectId, updateService);
router.delete('/:id', authenticateAdmin, validateObjectId, deleteService);

export default router;
