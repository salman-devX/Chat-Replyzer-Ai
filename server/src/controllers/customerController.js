import { Customer } from '../models/Customer.js';

export const getCustomers = async (req, res, next) => {
  try {
    const { search, temperature, page = 1, limit = 50, sort = '-createdAt' } = req.query;
    const filter = {};
    if (temperature) filter.temperature = temperature;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      Customer.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean({ virtuals: true }),
      Customer.countDocuments(filter),
    ]);
    res.json({ success: true, data: customers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).lean({ virtuals: true });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
    res.json({ success: true, data: customer });
  } catch (err) { next(err); }
};

export const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (err) { next(err); }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean({ virtuals: true });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
    res.json({ success: true, data: customer });
  } catch (err) { next(err); }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
    res.json({ success: true, message: 'Customer deleted.' });
  } catch (err) { next(err); }
};
