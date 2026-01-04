const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const Admin = require('../models/Admin');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalLostItems,
      totalFoundItems,
      totalClaims,
      pendingClaims,
      resolvedItems,
      recentItems,
      recentClaims
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Item.countDocuments({ type: 'lost', status: 'active' }),
      Item.countDocuments({ type: 'found', status: 'active' }),
      Claim.countDocuments(),
      Claim.countDocuments({ status: 'pending' }),
      Item.countDocuments({ status: 'resolved' }),
      Item.find().sort({ createdAt: -1 }).limit(5).populate('reportedBy', 'name usn'),
      Claim.find().sort({ createdAt: -1 }).limit(5).populate([
        { path: 'claimedBy', select: 'name usn' },
        { path: 'item', select: 'title' }
      ])
    ]);

    res.json({
      statistics: {
        totalUsers,
        totalLostItems,
        totalFoundItems,
        totalClaims,
        pendingClaims,
        resolvedItems
      },
      recentActivity: {
        recentItems,
        recentClaims
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Get all items
router.get('/items', authenticateAdmin, async (req, res) => {
  try {
    const { type, status, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (category) query.category = category;

    const items = await Item.find(query)
      .populate('reportedBy', 'name usn department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
});

// Get all claims
router.get('/claims', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const claims = await Claim.find(query)
      .populate([
        { path: 'item', populate: { path: 'reportedBy', select: 'name usn' } },
        { path: 'claimedBy', select: 'name usn department phone' },
        { path: 'reviewedBy', select: 'name employeeId' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Claim.countDocuments(query);

    res.json({
      claims,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch claims', error: error.message });
  }
});

// Review claim (approve/reject)
router.put('/claims/:id/review', authenticateAdmin, async (req, res) => {
  try {
    const { action, notes } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be approve or reject.' });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    claim.status = action === 'approve' ? 'approved' : 'rejected';
    claim.reviewNotes = notes;
    claim.reviewedBy = req.admin._id;
    claim.reviewedAt = new Date();

    await claim.save();

    // If approved, mark item as resolved
    if (action === 'approve') {
      await Item.findByIdAndUpdate(claim.item, { status: 'resolved' });
    }

    await claim.populate([
      { path: 'item', populate: { path: 'reportedBy', select: 'name usn' } },
      { path: 'claimedBy', select: 'name usn department phone' },
      { path: 'reviewedBy', select: 'name employeeId' }
    ]);

    res.json({
      message: `Claim ${claim.status} successfully`,
      claim
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to review claim', error: error.message });
  }
});

// Delete item
router.delete('/items/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete related claims
    await Claim.deleteMany({ item: req.params.id });

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item and related claims deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
});

// Toggle user status
router.put('/users/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle user status', error: error.message });
  }
});

module.exports = router;