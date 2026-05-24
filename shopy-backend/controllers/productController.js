const Product = require('../models/product.js')

// ── @desc    Get all products (with search & filter)
// ── @route   GET /api/products
// ── @access  Public
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sortBy } = req.query;

    // ── Build filter object ────────────────────────────
    let filter = { isActive: true };

    if (keyword) {
  filter.$or = [
    { name:        { $regex: keyword, $options: 'i' } },
    { description: { $regex: keyword, $options: 'i' } },
  ]
}
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ── Build sort object ──────────────────────────────
    let sort = {};
    if (sortBy === 'price_asc')  sort.price = 1;
    if (sortBy === 'price_desc') sort.price = -1;
    if (sortBy === 'newest')     sort.createdAt = -1;
    if (sortBy === 'rating')     sort.ratings = -1;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('seller', 'name email')
      .sort(sort);

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get single product
// ── @route   GET /api/products/:id
// ── @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Create a product
// ── @route   POST /api/products
// ── @access  Private/Admin/Seller
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      stock,
    } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: '❌ Please fill all required fields' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      stock,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update a product
// ── @route   PUT /api/products/:id
// ── @access  Private/Admin/Seller
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    product.name          = req.body.name          || product.name;
    product.description   = req.body.description   || product.description;
    product.price         = req.body.price         ?? product.price;
    product.discountPrice = req.body.discountPrice || product.discountPrice;
    product.images        = req.body.images        || product.images;
    product.category      = req.body.category      || product.category;
    product.stock         = req.body.stock         || product.stock;
    product.isActive      = req.body.isActive      ?? product.isActive;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Delete a product
// ── @route   DELETE /api/products/:id
// ── @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    await product.deleteOne();
    res.status(200).json({ message: '✅ Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};