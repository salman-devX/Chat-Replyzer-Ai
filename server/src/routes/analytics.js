import { Router } from 'express';
import { Lead } from '../models/Lead.js';
import { Call } from '../models/Call.js';
import { Deal } from '../models/Deal.js';
import { Customer } from '../models/Customer.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

// GET /api/analytics/overview
router.get('/overview', async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalLeads,
      totalCalls,
      hotLeads,
      wonDeals,
      monthlyLeads,
      monthlyLeadsLast,
      monthlyCalls,
      monthlyCallsLast,
    ] = await Promise.all([
      Lead.countDocuments(),
      Call.countDocuments(),
      Lead.countDocuments({ temperature: 'HOT' }),
      Deal.aggregate([{ $match: { stage: 'Won' } }, { $group: { _id: null, total: { $sum: '$value' } } }]),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Lead.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Call.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Call.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    ]);

    const revenue = wonDeals[0]?.total || 0;

    // Monthly call data for chart (last 6 months)
    const callsChart = await Call.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          handoffs: { $sum: { $cond: [{ $eq: ['$status', 'Handoff'] }, 1, 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const leadsChart = await Lead.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          total: { $sum: 1 },
          hot: { $sum: { $cond: [{ $eq: ['$temperature', 'HOT'] }, 1, 0] } },
          warm: { $sum: { $cond: [{ $eq: ['$temperature', 'WARM'] }, 1, 0] } },
          cold: { $sum: { $cond: [{ $eq: ['$temperature', 'COLD'] }, 1, 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      data: {
        kpis: {
          totalLeads,
          totalCalls,
          hotLeads,
          revenue,
          monthlyLeads,
          monthlyLeadsGrowth: monthlyLeadsLast ? Math.round(((monthlyLeads - monthlyLeadsLast) / monthlyLeadsLast) * 100) : 0,
          monthlyCalls,
          monthlyCallsGrowth: monthlyCallsLast ? Math.round(((monthlyCalls - monthlyCallsLast) / monthlyCallsLast) * 100) : 0,
        },
        callsChart,
        leadsChart,
      },
    });
  } catch (err) { next(err); }
});

export default router;
