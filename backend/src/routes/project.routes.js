import express from 'express';
import multer from 'multer';
import { authenticateAdmin, optionalAuthenticateAdmin } from '../middlewares/auth.middleware.js';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  handleUploadProjectImages,
} from '../controllers/project.controller.js';
import { uploadProjectImages } from '../middlewares/upload.projects.js';
import { validate, validateProject, validateProjectUpdate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Multer instance for parsing FormData (no file upload, just fields)
const parseFormData = multer().none();

router.post('/', authenticateAdmin, parseFormData, validate(validateProject), createProject);
router.post('/upload-images', authenticateAdmin, uploadProjectImages, handleUploadProjectImages);
router.get('/', optionalAuthenticateAdmin, getAllProjects);
router.get('/:id', optionalAuthenticateAdmin, getProjectById);
router.put('/:id', authenticateAdmin, parseFormData, validate(validateProjectUpdate), updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);

export default router;
