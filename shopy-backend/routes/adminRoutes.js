const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllOrdersAdmin,
  updateOrderStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ── All Admin Routes are Private/Admin only ───────────
router.get('/stats',          protect, authorizeRoles('admin'), getDashboardStats);
router.get('/users',          protect, authorizeRoles('admin'), getAllUsers);
router.get('/users/:id',      protect, authorizeRoles('admin'), getUserById);
router.put('/users/:id',      protect, authorizeRoles('admin'), updateUserRole);
router.delete('/users/:id',   protect, authorizeRoles('admin'), deleteUser);
router.get('/orders',         protect, authorizeRoles('admin'), getAllOrdersAdmin);
router.put('/orders/:id',     protect, authorizeRoles('admin'), updateOrderStatus);

module.exports = router;