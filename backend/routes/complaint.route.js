import express from 'express';
import Complaint from '../models/complaint.js';
import { asyncHandler } from '../utils/error.js';
import { authenticate, authorize } from '../utils/auth.js';

const router = express.Router();

// All complaint routes require auth
router.use(authenticate);

// Create complaint (student)
router.post(
  '/',
  authorize(['student']),
  asyncHandler(async (req, res) => {
    const { category, description, images = [] } = req.body;
    if (!category || !description) return res.status(400).json({ error: 'category and description are required' });

    const complaint = await Complaint.create({
      userId: req.user._id,
      category,
      description,
      images
    });
    res.status(201).json(complaint);
  })
);

// List complaints (role-scoped)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const role = req.user.role;
    let query = {};
    if (role === 'student') {
      query.userId = req.user._id;
    } else if (role === 'worker') {
      query.assignedWorkerId = req.user._id;
    } // admin sees all

    // Optional filters
    const { status, category, from, to } = req.query;
    if (status) query.status = status;
    if (category) query.category = category;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const page = parseInt(req.query.page || '1', 10);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Complaint.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Complaint.countDocuments(query)
    ]);

    res.json({ items, total, page, limit });
  })
);

// Get complaint by id (scope-aware)
router.get(
  '//:id',
  asyncHandler(async (req, res) => {
    const c = await Complaint.findById(req.params.id);
    if (!c) return res.status(404).json({ error: 'Complaint not found' });

    const role = req.user.role;
    const isOwner = c.userId.toString() === req.user._id.toString();
    const isAssigned = c.assignedWorkerId && c.assignedWorkerId.toString() === req.user._id.toString();

    if (role === 'student' && !isOwner) return res.status(403).json({ error: 'Forbidden' });
    if (role === 'worker' && !isAssigned) return res.status(403).json({ error: 'Forbidden' });

    res.json(c);
  })
);

// Assign worker (admin)
router.put(
  '/:id/assign',
  authorize(['admin']),
  asyncHandler(async (req, res) => {
    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ error: 'workerId is required' });

    const c = await Complaint.findById(req.params.id);
    if (!c) return res.status(404).json({ error: 'Complaint not found' });

    c.assignedWorkerId = workerId;
    if (c.status === 'Pending') c.status = 'Assigned';
    await c.save();

    res.json(c);
  })
);

// Update status (admin/worker)
router.put(
  '/:id/status',
  authorize(['admin', 'worker']),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const allowed = ['Pending', 'Assigned', 'In Progress', 'Resolved'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const c = await Complaint.findById(req.params.id);
    if (!c) return res.status(404).json({ error: 'Complaint not found' });

    // Worker can only move Assigned -> In Progress -> Resolved on their own complaints
    if (req.user.role === 'worker') {
      const isAssigned = c.assignedWorkerId && c.assignedWorkerId.toString() === req.user._id.toString();
      if (!isAssigned) return res.status(403).json({ error: 'Forbidden' });
      const validTransitions = {
        Assigned: ['In Progress'],
        'In Progress': ['Resolved']
      };
      const options = validTransitions[c.status] || [];
      if (!options.includes(status)) return res.status(400).json({ error: 'Invalid status transition' });
    }

    c.status = status;
    await c.save();
    res.json(c);
  })
);

// Add comment (admin/worker)
router.post(
  '/:id/comments',
  authorize(['admin', 'worker']),
  asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const c = await Complaint.findById(req.params.id);
    if (!c) return res.status(404).json({ error: 'Complaint not found' });

    // If worker, ensure assigned to this complaint
    if (req.user.role === 'worker') {
      const isAssigned = c.assignedWorkerId && c.assignedWorkerId.toString() === req.user._id.toString();
      if (!isAssigned) return res.status(403).json({ error: 'Forbidden' });
    }

    c.comments.push({
      author: req.user._id,
      message,
      timestamp: new Date()
    });
    await c.save();

    res.status(201).json(c);
  })
);

export default router;