import express from 'express';
import { authenticateAdmin, optionalAuthenticateAdmin } from '../middlewares/auth.middleware.js';
import {
  checkSlug,
  createBlog,
  getAllBlogs,
  getBlogBySlugOrId,
  updateBlog,
  deleteBlog,
  handleUploadBlogImage,
} from '../controllers/blog.controller.js';
import {
  validate,
  validateBlog,
  validateBlogUpdate,
  validateBlogListQuery,
  validateObjectId,
} from '../middlewares/validation.middleware.js';
import { uploadBlogImage } from '../middlewares/upload.blogs.js';

const router = express.Router();

router.post('/', authenticateAdmin, validate(validateBlog), createBlog);
router.post('/upload-image', authenticateAdmin, uploadBlogImage, handleUploadBlogImage);
router.get('/check-slug', checkSlug);
router.get('/', optionalAuthenticateAdmin, validate(validateBlogListQuery), getAllBlogs);
router.get('/:slugOrId', optionalAuthenticateAdmin, getBlogBySlugOrId);
router.put('/:id', authenticateAdmin, validate([...validateObjectId, ...validateBlogUpdate]), updateBlog);
router.delete('/:id', authenticateAdmin, validate(validateObjectId), deleteBlog);

export default router;
