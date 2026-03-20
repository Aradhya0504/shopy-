const Order = require('../models/order.js');
const Cart = require('../models/cart.js');
const Product = require('../models/product.js');

// ── @desc    Create new order (checkout)
// ── @route   POST /api/orders
// ── @access  Private
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: '❌ Cart is empty' });
    }

    // Create order from cart
    const order = await Order.create({
      user:            req.user._id,
      items:           cart.items,
      shippingAddress,
      paymentMethod,
      totalPrice:      cart.totalPrice,
    });

    // Clear cart after order
    cart.items      = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get my orders
// ── @route   GET /api/orders/myorders
// ── @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price images');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get order by ID
// ── @route   GET /api/orders/:id
// ── @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user',          'name email')
      .populate('items.product', 'name price images');

    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update order to paid
// ── @route   PUT /api/orders/:id/pay
// ── @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    order.paymentStatus = 'paid';
    order.paidAt        = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update order to delivered
// ── @route   PUT /api/orders/:id/deliver
// ── @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    order.orderStatus   = 'delivered';
    order.deliveredAt   = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Cancel order
// ── @route   PUT /api/orders/:id/cancel
// ── @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ message: '❌ Cannot cancel delivered order' });
    }

    order.orderStatus = 'cancelled';
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get all orders (admin)
// ── @route   GET /api/orders
// ── @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user',          'name email')
      .populate('items.product', 'name price');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  getAllOrders,
};