import { Router } from 'express';
import { getLeads, getLead, createLead, updateLead, deleteLead, getLeadStats } from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/stats', getLeadStats);
router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLead).put(updateLead).delete(deleteLead);

export default router;
