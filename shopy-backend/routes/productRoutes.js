const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ── Public Routes ─────────────────────────────────────
router.get('/',    getProducts);
router.get('/:id', getProductById);

// ── Private Routes (Admin/Seller only) ────────────────
router.post('/',    protect, authorizeRoles('admin', 'seller'), createProduct);
router.put('/:id',  protect, authorizeRoles('admin', 'seller'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin'),         deleteProduct);

module.exports = router;
