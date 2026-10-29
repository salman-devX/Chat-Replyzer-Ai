import { Lead } from '../models/Lead.js';

// GET /api/leads
export const getLeads = async (req, res, next) => {
  try {
    const { status, temperature, search, page = 1, limit = 50, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (temperature) filter.temperature = temperature;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean({ virtuals: true }),
      Lead.countDocuments(filter),
    ]);

    res.json({ success: true, data: leads, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/:id
export const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).lean({ virtuals: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// POST /api/leads
export const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// PUT /api/leads/:id
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean({ virtuals: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/leads/:id
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, message: 'Lead deleted.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/stats
export const getLeadStats = async (req, res, next) => {
  try {
    const [total, hot, warm, cold, byStatus] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ temperature: 'HOT' }),
      Lead.countDocuments({ temperature: 'WARM' }),
      Lead.countDocuments({ temperature: 'COLD' }),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);
    res.json({ success: true, data: { total, hot, warm, cold, byStatus } });
  } catch (err) {
    next(err);
  }
};
