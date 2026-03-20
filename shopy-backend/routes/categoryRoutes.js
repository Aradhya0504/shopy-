const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ── Public Routes ─────────────────────────────────────
router.get('/',    getCategories);
router.get('/:id', getCategoryById);

// ── Private Routes (Admin only) ───────────────────────
router.post('/',    protect, authorizeRoles('admin'), createCategory);
router.put('/:id',  protect, authorizeRoles('admin'), updateCategory);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCategory);

module.exports = router;
