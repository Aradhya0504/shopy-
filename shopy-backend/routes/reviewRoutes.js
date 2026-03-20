const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// ── Public Routes ─────────────────────────────────────
router.get('/:productId', getProductReviews);

// ── Private Routes ────────────────────────────────────
router.post('/:productId',    protect, addReview);
router.put('/:reviewId',      protect, updateReview);
router.delete('/:reviewId',   protect, deleteReview);

module.exports = router;