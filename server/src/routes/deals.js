import { Router } from 'express';
import { getDeals, getDeal, createDeal, updateDeal, deleteDeal, getDealStats } from '../controllers/dealController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/stats', getDealStats);
router.route('/').get(getDeals).post(createDeal);
router.route('/:id').get(getDeal).put(updateDeal).delete(deleteDeal);
export default router;
