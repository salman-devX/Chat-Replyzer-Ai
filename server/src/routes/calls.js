import { Router } from 'express';
import { getCalls, getCall, createCall, updateCall, deleteCall, getCallStats } from '../controllers/callController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/stats', getCallStats);
router.route('/').get(getCalls).post(createCall);
router.route('/:id').get(getCall).put(updateCall).delete(deleteCall);
export default router;
