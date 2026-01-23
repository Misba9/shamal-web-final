import express from 'express';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { listCategories, createCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', listCategories);
router.post('/', authenticateAdmin, createCategory);

export default router;
