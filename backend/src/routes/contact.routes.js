import express from 'express';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import {
  createContact,
  getContacts,
  getContactById,
  exportContactsCsv,
  updateContact,
  deleteContact,
} from '../controllers/contact.controller.js';
import {
  validate,
  validateContact,
  validateContactUpdate,
  validateObjectId,
} from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/', validate(validateContact), createContact);
router.get('/export', authenticateAdmin, exportContactsCsv);
router.get('/', authenticateAdmin, getContacts);
router.get('/:id', authenticateAdmin, validate(validateObjectId), getContactById);
router.patch('/:id', authenticateAdmin, validate(validateObjectId), validate(validateContactUpdate), updateContact);
router.delete('/:id', authenticateAdmin, validate(validateObjectId), deleteContact);

export default router;
