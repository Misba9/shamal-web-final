import express from 'express';
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/leads.controller.js';
import { validate, validateLead, validateLeadUpdate, validateObjectId } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/', validate(validateLead), createLead);
router.get('/export', exportLeadsCsv);
router.get('/', getAllLeads);
router.get('/:id', validate(validateObjectId), getLeadById);
router.put('/:id', validate([...validateObjectId, ...validateLeadUpdate]), updateLead);
router.delete('/:id', validate(validateObjectId), deleteLead);

export default router;
