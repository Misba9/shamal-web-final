import express from 'express';
import { authenticateAdmin, optionalAuthenticateAdmin } from '../middlewares/auth.middleware.js';
import {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  handleUploadProductImage,
} from '../controllers/product.controller.js';
import { uploadProductImage } from '../middlewares/upload.products.js';
import { validateObjectId } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/', authenticateAdmin, createProduct);
router.post('/upload-image', authenticateAdmin, uploadProductImage, handleUploadProductImage);
router.get('/', optionalAuthenticateAdmin, getAllProducts);
router.get('/:slug', optionalAuthenticateAdmin, getProductBySlug);
router.put('/:id', authenticateAdmin, validateObjectId, updateProduct);
router.delete('/:id', authenticateAdmin, validateObjectId, deleteProduct);

export default router;
