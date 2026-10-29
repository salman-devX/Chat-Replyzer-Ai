import { Knowledge } from '../models/Knowledge.js';

export const getKnowledge = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };
    const items = await Knowledge.find(filter).sort('-usageCount').lean({ virtuals: true });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

export const getKnowledgeItem = async (req, res, next) => {
  try {
    const item = await Knowledge.findById(req.params.id).lean({ virtuals: true });
    if (!item) return res.status(404).json({ success: false, message: 'Knowledge item not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const createKnowledge = async (req, res, next) => {
  try {
    const item = await Knowledge.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const updateKnowledge = async (req, res, next) => {
  try {
    const item = await Knowledge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean({ virtuals: true });
    if (!item) return res.status(404).json({ success: false, message: 'Knowledge item not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const deleteKnowledge = async (req, res, next) => {
  try {
    const item = await Knowledge.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Knowledge item not found.' });
    res.json({ success: true, message: 'Knowledge item deleted.' });
  } catch (err) { next(err); }
};
