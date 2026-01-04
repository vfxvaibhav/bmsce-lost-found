const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'Sports', 'Others']
  },
  color: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['lost', 'found']
  },
  location: {
    type: String,
    required: true
  },
  dateReported: {
    type: Date,
    default: Date.now
  },
  dateLostFound: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  imageFeatures: {
    type: [Number],
    default: []
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'resolved'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better search performance
itemSchema.index({ title: 'text', description: 'text' });
itemSchema.index({ category: 1, type: 1, status: 1 });

module.exports = mongoose.model('Item', itemSchema);