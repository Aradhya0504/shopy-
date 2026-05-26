const express = require('express');
const router  = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// ── All Order Routes are Private ──────────────────────
// NOTE: /myorders MUST be before /:id so Express doesn't
//       treat the string "myorders" as an order ID param.
router.post('/',          protect, createOrder);
router.get('/myorders',   protect, getMyOrders);
router.get('/:id',        protect, getOrderById);

module.exports = router;
