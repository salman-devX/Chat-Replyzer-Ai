import { User } from '../models/User.js';
import { Lead } from '../models/Lead.js';
import { Call } from '../models/Call.js';
import { Deal } from '../models/Deal.js';
import { Customer } from '../models/Customer.js';

export const getTeam = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt').lean({ virtuals: true });
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

export const getTeamMember = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).lean({ virtuals: true });
    if (!user) return res.status(404).json({ success: false, message: 'Team member not found.' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

export const createTeamMember = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
};

export const updateTeamMember = async (req, res, next) => {
  try {
    const { password, ...updates } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).lean({ virtuals: true });
    if (!user) return res.status(404).json({ success: false, message: 'Team member not found.' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

export const deleteTeamMember = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Team member not found.' });
    res.json({ success: true, message: 'Team member removed.' });
  } catch (err) { next(err); }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalLeads, totalCustomers, totalCalls, totalDeals, wonDeals] = await Promise.all([
      Lead.countDocuments(),
      Customer.countDocuments(),
      Call.countDocuments(),
      Deal.countDocuments(),
      Deal.aggregate([
        { $match: { stage: 'Won' } },
        { $group: { _id: null, total: { $sum: '$value' } } },
      ]),
    ]);

    const callsToday = await Call.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    const hotLeads = await Lead.countDocuments({ temperature: 'HOT' });
    const revenue = wonDeals[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalLeads,
        totalCustomers,
        totalCalls,
        totalDeals,
        callsToday,
        hotLeads,
        revenue,
      },
    });
  } catch (err) { next(err); }
};
