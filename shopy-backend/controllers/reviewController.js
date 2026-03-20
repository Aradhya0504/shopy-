const Review = require('../models/review.js');
const Product = require('../models/product.js');

// ── @desc    Get all reviews for a product
// ── @route   GET /api/reviews/:productId
// ── @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name profilePicture');

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Add a review
// ── @route   POST /api/reviews/:productId
// ── @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user:    req.user._id,
      product: productId,
    });
    if (alreadyReviewed) {
      return res.status(400).json({ message: '❌ Product already reviewed' });
    }

    // Create review
    const review = await Review.create({
      user:    req.user._id,
      product: productId,
      rating,
      comment,
    });

    // ── Update product ratings ─────────────────────────
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.ratings    = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update a review
// ── @route   PUT /api/reviews/:reviewId
// ── @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: '❌ Review not found' });
    }

    // Check review belongs to user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '❌ Not authorized' });
    }

    review.rating  = req.body.rating  || review.rating;
    review.comment = req.body.comment || review.comment;

    const updatedReview = await review.save();

    // ── Update product ratings ─────────────────────────
    const product    = await Product.findById(review.product);
    const allReviews = await Review.find({ product: review.product });
    product.ratings  = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await product.save();

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Delete a review
// ── @route   DELETE /api/reviews/:reviewId
// ── @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: '❌ Review not found' });
    }

    // Check review belongs to user or admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: '❌ Not authorized' });
    }

    await review.deleteOne();

    // ── Update product ratings ─────────────────────────
    const product    = await Product.findById(review.product);
    const allReviews = await Review.find({ product: review.product });
    product.numReviews = allReviews.length;
    product.ratings    = allReviews.length > 0
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
      : 0;
    await product.save();

    res.status(200).json({ message: '✅ Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
};