const Wishlist = require('../models/wishlist.js');
const Product  = require('../models/product.js');

// ── @desc    Get user's wishlist
// ── @route   GET /api/wishlist
// ── @access  Private
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'name price discountPrice images stock ratings numReviews category');

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

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      // No wishlist yet — create one
      wishlist = await Wishlist.create({
        user:     req.user._id,
        products: [productId],
      });
    } else {
      // Already have a wishlist — check for duplicates
      if (wishlist.products.map((p) => p.toString()).includes(productId)) {
        return res.status(400).json({ message: '❌ Product already in wishlist' });
      }
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate('products', 'name price discountPrice images stock ratings numReviews category');
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

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    );

    await wishlist.save();
    await wishlist.populate('products', 'name price discountPrice images stock ratings numReviews category');
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Clear entire wishlist
// ── @route   DELETE /api/wishlist
// ── @access  Private
const clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: '✅ Wishlist cleared' });
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
