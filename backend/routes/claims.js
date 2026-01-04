const express = require('express');
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const { authenticateUser } = require('../middleware/auth');
const imageSimilarity = require('../ai/imageSimilarity');
const path = require('path');

const router = express.Router();

// Create claim
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { itemId, description, contactInfo } = req.body;

    // Verify item exists and is active
    const item = await Item.findOne({ _id: itemId, status: 'active' });
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not available for claiming' });
    }

    // Check if user already claimed this item
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimedBy: req.user._id
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'You have already claimed this item' });
    }

    const claim = new Claim({
      item: itemId,
      claimedBy: req.user._id,
      description,
      contactInfo,
      similarityScore: 0 // Will be calculated by admin
    });

    await claim.save();
    await claim.populate([
      { path: 'item', populate: { path: 'reportedBy', select: 'name usn' } },
      { path: 'claimedBy', select: 'name usn department' }
    ]);

    res.status(201).json({
      message: 'Claim submitted successfully',
      claim
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create claim', error: error.message });
  }
});

// Get user's claims
router.get('/my-claims', authenticateUser, async (req, res) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user._id })
      .populate([
        { path: 'item', populate: { path: 'reportedBy', select: 'name usn' } }
      ])
      .sort({ createdAt: -1 });

    res.json({ claims });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch claims', error: error.message });
  }
});

// Get claims for user's items
router.get('/for-my-items', authenticateUser, async (req, res) => {
  try {
    // Find user's items
    const userItems = await Item.find({ reportedBy: req.user._id });
    const itemIds = userItems.map(item => item._id);

    // Find claims for user's items
    const claims = await Claim.find({
      $or: [
        { lostItem: { $in: itemIds } },
        { foundItem: { $in: itemIds } }
      ]
    })
    .populate([
      { path: 'lostItem', populate: { path: 'reportedBy', select: 'name usn' } },
      { path: 'foundItem', populate: { path: 'reportedBy', select: 'name usn' } },
      { path: 'claimedBy', select: 'name usn department phone' }
    ])
    .sort({ createdAt: -1 });

    res.json({ claims });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch claims', error: error.message });
  }
});

// Get single claim
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate([
        { path: 'lostItem', populate: { path: 'reportedBy', select: 'name usn department phone' } },
        { path: 'foundItem', populate: { path: 'reportedBy', select: 'name usn department phone' } },
        { path: 'claimedBy', select: 'name usn department phone' },
        { path: 'reviewedBy', select: 'name employeeId' }
      ]);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Check if user is authorized to view this claim
    const isAuthorized = claim.claimedBy._id.toString() === req.user._id.toString() ||
                        claim.lostItem.reportedBy._id.toString() === req.user._id.toString() ||
                        claim.foundItem.reportedBy._id.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view this claim' });
    }

    res.json({ claim });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch claim', error: error.message });
  }
});

module.exports = router;