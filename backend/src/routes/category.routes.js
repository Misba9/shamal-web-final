import express from 'express';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { listCategories, createCategory, deleteCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', listCategories);
router.post('/', authenticateAdmin, createCategory);
router.delete('/:id', authenticateAdmin, deleteCategory);

export default router;
