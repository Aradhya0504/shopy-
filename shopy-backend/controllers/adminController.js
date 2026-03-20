const User = require('../models/user.js');
const Product = require('../models/product.js');
const Order = require('../models/order.js');
const Category = require('../models/category.js');

// ── @desc    Get dashboard stats
// ── @route   GET /api/admin/stats
// ── @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Count all documents
    const totalUsers      = await User.countDocuments();
    const totalProducts   = await Product.countDocuments();
    const totalOrders     = await Order.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Calculate total revenue
    const orders        = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue  = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalRevenue,
      recentOrders,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get all users
// ── @route   GET /api/admin/users
// ── @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get user by ID
// ── @route   GET /api/admin/users/:id
// ── @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update user role
// ── @route   PUT /api/admin/users/:id
// ── @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    user.role     = req.body.role     || user.role;
    user.isActive = req.body.isActive ?? user.isActive;

    const updatedUser = await user.save();
    res.status(200).json({
      _id:      updatedUser._id,
      name:     updatedUser.name,
      email:    updatedUser.email,
      role:     updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Delete user
// ── @route   DELETE /api/admin/users/:id
// ── @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ message: '✅ User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get all orders
// ── @route   GET /api/admin/orders
// ── @access  Private/Admin
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user',          'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update order status
// ── @route   PUT /api/admin/orders/:id
// ── @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    order.orderStatus   = req.body.orderStatus   || order.orderStatus;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllOrdersAdmin,
  updateOrderStatus,
};
