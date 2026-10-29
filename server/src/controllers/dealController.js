import { Deal } from '../models/Deal.js';

export const getDeals = async (req, res, next) => {
  try {
    const { stage, priority, sort = '-createdAt' } = req.query;
    const filter = {};
    if (stage) filter.stage = stage;
    if (priority) filter.priority = priority;
    const deals = await Deal.find(filter).sort(sort).lean({ virtuals: true });
    res.json({ success: true, data: deals });
  } catch (err) { next(err); }
};

export const getDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id).lean({ virtuals: true });
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found.' });
    res.json({ success: true, data: deal });
  } catch (err) { next(err); }
};

export const createDeal = async (req, res, next) => {
  try {
    const deal = await Deal.create(req.body);
    res.status(201).json({ success: true, data: deal });
  } catch (err) { next(err); }
};

export const updateDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean({ virtuals: true });
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found.' });
    res.json({ success: true, data: deal });
  } catch (err) { next(err); }
};

export const deleteDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found.' });
    res.json({ success: true, message: 'Deal deleted.' });
  } catch (err) { next(err); }
};

export const getDealStats = async (req, res, next) => {
  try {
    const pipeline = await Deal.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 }, totalValue: { $sum: '$value' } } },
    ]);
    res.json({ success: true, data: pipeline });
  } catch (err) { next(err); }
};
