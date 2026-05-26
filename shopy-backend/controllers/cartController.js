const Cart    = require('../models/cart.js');
const Product = require('../models/product.js');

// ── @desc    Get user's cart
// ── @route   GET /api/cart
// ── @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price discountPrice images stock');

    if (!cart) {
      return res.status(200).json({ items: [], totalPrice: 0 });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Add item to cart (or increase qty if already present)
// ── @route   POST /api/cart
// ── @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: '❌ Not enough stock available' });
    }

    const price = product.discountPrice || product.price;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // No cart yet — create one
      cart = await Cart.create({
        user:       req.user._id,
        items:      [{ product: productId, quantity, price }],
        totalPrice: price * quantity,
      });
    } else {
      // Cart exists — update qty if product already in cart, else push
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }

      // Recalculate total
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
      );

      await cart.save();
    }

    await cart.populate('items.product', 'name price discountPrice images stock');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update quantity of a cart item
// ── @route   PUT /api/cart/:itemId
// ── @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: '❌ Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: '❌ Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: '❌ Item not found in cart' });
    }

    item.quantity = quantity;

    cart.totalPrice = cart.items.reduce(
      (acc, i) => acc + i.price * i.quantity, 0
    );

    await cart.save();
    await cart.populate('items.product', 'name price discountPrice images stock');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Remove one item from cart
// ── @route   DELETE /api/cart/:itemId
// ── @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: '❌ Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );

    await cart.save();
    await cart.populate('items.product', 'name price discountPrice images stock');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Clear entire cart
// ── @route   DELETE /api/cart
// ── @access  Private
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ items: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
