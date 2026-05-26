const express = require('express');
const router  = express.Router();
const { createPaymentIntent } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// ── Private — user must be logged in to pay ───────────
router.post('/create-intent', protect, createPaymentIntent);

module.exports = router;
