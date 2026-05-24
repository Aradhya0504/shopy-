const Wishlist = require('../models/wishlist.js');
const Product = require('../models/product.js');

// ── @desc    Get my wishlist
// ── @route   GET /api/wishlist
// ── @access  Private
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'name price discountPrice images ratings');

    if (!wishlist) {
      return res.status(200).json({ products: [] });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Add product to wishlist
// ── @route   POST /api/wishlist
// ── @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    // Check if product already in wishlist
    if (wishlist.products.some(id => id.toString() === productId)) {
    return res.status(400).json({ message: '❌ Product already in wishlist' });
    }

    // Add product
    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Remove product from wishlist
// ── @route   DELETE /api/wishlist/:productId
// ── @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: '❌ Wishlist not found' });
    }

    // Remove product
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== req.params.productId
    );

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Clear wishlist
// ── @route   DELETE /api/wishlist
// ── @access  Private
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: '❌ Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({ message: '✅ Wishlist cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};