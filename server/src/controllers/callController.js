import { Call } from '../models/Call.js';

export const getCalls = async (req, res, next) => {
  try {
    const { status, agentType, page = 1, limit = 50, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (agentType) filter.agentType = agentType;

    const skip = (Number(page) - 1) * Number(limit);
    const [calls, total] = await Promise.all([
      Call.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean({ virtuals: true }),
      Call.countDocuments(filter),
    ]);
    res.json({ success: true, data: calls, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};

export const getCall = async (req, res, next) => {
  try {
    const call = await Call.findById(req.params.id).lean({ virtuals: true });
    if (!call) return res.status(404).json({ success: false, message: 'Call not found.' });
    res.json({ success: true, data: call });
  } catch (err) { next(err); }
};

export const createCall = async (req, res, next) => {
  try {
    const call = await Call.create(req.body);
    res.status(201).json({ success: true, data: call });
  } catch (err) { next(err); }
};

export const updateCall = async (req, res, next) => {
  try {
    const call = await Call.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean({ virtuals: true });
    if (!call) return res.status(404).json({ success: false, message: 'Call not found.' });
    res.json({ success: true, data: call });
  } catch (err) { next(err); }
};

export const deleteCall = async (req, res, next) => {
  try {
    const call = await Call.findByIdAndDelete(req.params.id);
    if (!call) return res.status(404).json({ success: false, message: 'Call not found.' });
    res.json({ success: true, message: 'Call deleted.' });
  } catch (err) { next(err); }
};

export const getCallStats = async (req, res, next) => {
  try {
    const [total, completed, handoff, noAnswer] = await Promise.all([
      Call.countDocuments(),
      Call.countDocuments({ status: 'Completed' }),
      Call.countDocuments({ status: 'Handoff' }),
      Call.countDocuments({ status: 'No Answer' }),
    ]);
    res.json({ success: true, data: { total, completed, handoff, noAnswer } });
  } catch (err) { next(err); }
};
