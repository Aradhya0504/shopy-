const User = require('../models/user');
const generateToken = require('../utils/generateToken');

// ── @desc    Register a new user
// ── @route   POST /api/auth/register
// ── @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: '❌ Please fill all fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: '❌ User already exists' });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Send response with token
    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Login user
// ── @route   POST /api/auth/login
// ── @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: '❌ Please fill all fields' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    // Send response with token
    res.status(200).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get logged in user profile
// ── @route   GET /api/auth/profile
// ── @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }
    res.status(200).json({
      _id:            user._id,
      name:           user.name,
      email:          user.email,
      role:           user.role,
      phone:          user.phone,
      address:        user.address,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update user profile
// ── @route   PUT /api/auth/profile
// ── @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    // Update only provided fields
    user.name           = req.body.name           || user.name;
    user.email          = req.body.email          || user.email;
    user.phone          = req.body.phone          || user.phone;
    user.address        = req.body.address        || user.address;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    // Update password only if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id:            updatedUser._id,
      name:           updatedUser.name,
      email:          updatedUser.email,
      role:           updatedUser.role,
      phone:          updatedUser.phone,
      address:        updatedUser.address,
      profilePicture: updatedUser.profilePicture,
      token:          generateToken(updatedUser._id, updatedUser.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
