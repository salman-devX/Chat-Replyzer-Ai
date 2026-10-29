import { Router } from 'express';
import { getTeam, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember, getDashboardStats } from '../controllers/teamController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/dashboard-stats', getDashboardStats);
router.route('/').get(getTeam).post(adminOnly, createTeamMember);
router.route('/:id').get(getTeamMember).put(adminOnly, updateTeamMember).delete(adminOnly, deleteTeamMember);
export default router;
