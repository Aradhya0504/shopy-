const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  getAllOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ── Private Routes ────────────────────────────────────
router.post('/',              protect, createOrder);
router.get('/myorders',       protect, getMyOrders);
router.get('/:id',            protect, getOrderById);
router.put('/:id/pay',        protect, updateOrderToPaid);
router.put('/:id/cancel',     protect, cancelOrder);

// ── Admin Only Routes ─────────────────────────────────
router.put('/:id/deliver', protect, authorizeRoles('admin'), updateOrderToDelivered);

module.exports = router;