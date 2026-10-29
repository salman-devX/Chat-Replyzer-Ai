import { Followup } from '../models/Followup.js';

export const getFollowups = async (req, res, next) => {
  try {
    const { status, priority, sort = 'scheduledAt' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const followups = await Followup.find(filter).sort(sort).lean({ virtuals: true });
    res.json({ success: true, data: followups });
  } catch (err) { next(err); }
};

export const getFollowup = async (req, res, next) => {
  try {
    const followup = await Followup.findById(req.params.id).lean({ virtuals: true });
    if (!followup) return res.status(404).json({ success: false, message: 'Follow-up not found.' });
    res.json({ success: true, data: followup });
  } catch (err) { next(err); }
};

export const createFollowup = async (req, res, next) => {
  try {
    const followup = await Followup.create(req.body);
    res.status(201).json({ success: true, data: followup });
  } catch (err) { next(err); }
};

export const updateFollowup = async (req, res, next) => {
  try {
    const followup = await Followup.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean({ virtuals: true });
    if (!followup) return res.status(404).json({ success: false, message: 'Follow-up not found.' });
    res.json({ success: true, data: followup });
  } catch (err) { next(err); }
};

export const deleteFollowup = async (req, res, next) => {
  try {
    const followup = await Followup.findByIdAndDelete(req.params.id);
    if (!followup) return res.status(404).json({ success: false, message: 'Follow-up not found.' });
    res.json({ success: true, message: 'Follow-up deleted.' });
  } catch (err) { next(err); }
};
