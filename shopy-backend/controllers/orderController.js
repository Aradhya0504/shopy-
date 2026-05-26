const Order = require('../models/order.js');
const Cart  = require('../models/cart.js');

// ── @desc    Create a new order (items come from user's cart)
// ── @route   POST /api/orders
// ── @access  Private
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, paymentStatus } = req.body;

    // ── Validate shipping address ──────────────────────
    const { street, city, state, country, zip } = shippingAddress || {};
    if (!street || !city || !state || !country || !zip) {
      return res.status(400).json({ message: '❌ Please provide a complete shipping address' });
    }

    // ── Get user's cart ────────────────────────────────
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: '❌ Your cart is empty' });
    }

    // ── Map cart items → order items ──────────────────
    const orderItems = cart.items.map((item) => ({
      product:  item.product._id,
      quantity: item.quantity,
      price:    item.price,
    }));

    // ── Create order ───────────────────────────────────
    const isPaid = paymentStatus === 'paid';
    const order = await Order.create({
      user:           req.user._id,
      items:          orderItems,
      shippingAddress,
      paymentMethod:  paymentMethod  || 'cod',
      paymentStatus:  paymentStatus  || 'pending',
      totalPrice:     cart.totalPrice,
      ...(isPaid && { paidAt: new Date() }), // set paidAt only if Stripe payment succeeded
    });

    // ── Clear cart once order is placed ───────────────
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get logged-in user's orders
// ── @route   GET /api/orders/myorders
// ── @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get single order by ID
// ── @route   GET /api/orders/:id
// ── @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price images')
      .populate('user',          'name email');

    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    // Only the order owner or an admin can view it
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: '❌ Not authorized' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
