import express from 'express';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import {
  subscribe,
  getAll,
  exportCsv,
  deleteSubscriber,
} from '../controllers/newsletter.controller.js';
import { validate, validateNewsletterSubscribe, validateObjectId } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/', validate(validateNewsletterSubscribe), subscribe);
router.get('/export', authenticateAdmin, exportCsv);
router.get('/', authenticateAdmin, getAll);
router.delete('/:id', authenticateAdmin, validate(validateObjectId), deleteSubscriber);

export default router;
