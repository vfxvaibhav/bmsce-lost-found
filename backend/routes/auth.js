const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Student Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, usn, phone, department, year, password } = req.body;

    // Validate BMSCE email domain
    if (!email.endsWith('@bmsce.ac.in')) {
      return res.status(400).json({ message: 'Please use your BMSCE email address (@bmsce.ac.in)' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { usn }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or USN already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      usn: usn.toUpperCase(),
      phone,
      department,
      year,
      password
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usn: user.usn,
        department: user.department,
        year: user.year
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate BMSCE email domain
    if (!email.endsWith('@bmsce.ac.in')) {
      return res.status(400).json({ message: 'Please use your BMSCE email address (@bmsce.ac.in)' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usn: user.usn,
        department: user.department,
        year: user.year
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        employeeId: admin.employeeId,
        department: admin.department,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Admin login failed', error: error.message });
  }
});

// Get current user profile
router.get('/profile', authenticateUser, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      usn: req.user.usn,
      department: req.user.department,
      year: req.user.year
    }
  });
});

module.exports = router;