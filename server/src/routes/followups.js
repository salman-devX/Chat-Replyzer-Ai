import { Router } from 'express';
import { getFollowups, getFollowup, createFollowup, updateFollowup, deleteFollowup } from '../controllers/followupController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.route('/').get(getFollowups).post(createFollowup);
router.route('/:id').get(getFollowup).put(updateFollowup).delete(deleteFollowup);
export default router;
