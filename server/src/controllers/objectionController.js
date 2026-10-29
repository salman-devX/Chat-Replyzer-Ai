import { Objection } from '../models/Objection.js';

export const getObjections = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    const objections = await Objection.find(filter).sort('-frequency').lean({ virtuals: true });
    res.json({ success: true, data: objections });
  } catch (err) { next(err); }
};

export const getObjection = async (req, res, next) => {
  try {
    const objection = await Objection.findById(req.params.id).lean({ virtuals: true });
    if (!objection) return res.status(404).json({ success: false, message: 'Objection not found.' });
    res.json({ success: true, data: objection });
  } catch (err) { next(err); }
};

export const createObjection = async (req, res, next) => {
  try {
    const objection = await Objection.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: objection });
  } catch (err) { next(err); }
};

export const updateObjection = async (req, res, next) => {
  try {
    const objection = await Objection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean({ virtuals: true });
    if (!objection) return res.status(404).json({ success: false, message: 'Objection not found.' });
    res.json({ success: true, data: objection });
  } catch (err) { next(err); }
};

export const deleteObjection = async (req, res, next) => {
  try {
    const objection = await Objection.findByIdAndDelete(req.params.id);
    if (!objection) return res.status(404).json({ success: false, message: 'Objection not found.' });
    res.json({ success: true, message: 'Objection deleted.' });
  } catch (err) { next(err); }
};
