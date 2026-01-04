const express = require('express');
const Item = require('../models/Item');
const { authenticateUser } = require('../middleware/auth');
const upload = require('../middleware/upload');
const imageSimilarity = require('../ai/imageSimilarity');
const path = require('path');

const router = express.Router();

// Report lost/found item
router.post('/report', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const { title, description, category, color, type, location, dateLostFound } = req.body;

    // Extract image features for AI comparison (with error handling)
    const imagePath = path.join(__dirname, '../uploads', req.file.filename);
    let features = [];
    try {
      features = await imageSimilarity.extractFeatures(imagePath) || [];
    } catch (aiError) {
      console.log('AI feature extraction failed, continuing without features:', aiError.message);
    }

    const item = new Item({
      title,
      description,
      category,
      color,
      type,
      location,
      dateLostFound: new Date(dateLostFound),
      image: req.file.filename,
      imageFeatures: features,
      reportedBy: req.user._id
    });

    await item.save();
    await item.populate('reportedBy', 'name usn department');

    res.status(201).json({
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully`,
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to report item', error: error.message });
  }
});

// Get all items with filters
router.get('/', async (req, res) => {
  try {
    const { type, category, search, status = 'active' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { status };

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

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

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reportedBy', 'name usn department phone');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item', error: error.message });
  }
});

// Get user's items
router.get('/user/my-items', authenticateUser, async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user items', error: error.message });
  }
});

// Update item
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name usn department');

    res.json({
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
});

// Delete item
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
});

module.exports = router;