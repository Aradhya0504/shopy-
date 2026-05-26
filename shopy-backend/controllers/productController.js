const Product = require('../models/product.js');

// ── @desc    Get all products (with filters, search, sort)
// ── @route   GET /api/products
// ── @access  Public
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sortBy } = req.query;

    // ── Build filter ──────────────────────────────────
    const filter = { isActive: true };

    if (keyword) {
      filter.$or = [
        { name:        { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ── Build sort ────────────────────────────────────
    let sort = { createdAt: -1 };           // default: newest first
    if (sortBy === 'price_asc')  sort = { price:     1  };
    if (sortBy === 'price_desc') sort = { price:    -1  };
    if (sortBy === 'newest')     sort = { createdAt: -1 };
    if (sortBy === 'rating')     sort = { ratings:   -1 };

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('seller',   'name')
      .sort(sort);

    res.status(200).json({ products, count: products.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get single product by ID
// ── @route   GET /api/products/:id
// ── @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('seller',   'name');

    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Create a new product
// ── @route   POST /api/products
// ── @access  Private/Admin/Seller
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, images, category, stock } = req.body;

    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: '❌ Please fill all required fields' });
    }

    const product = await Product.create({
      name, description, price, discountPrice, images, category, stock,
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

    const { name, description, price, discountPrice, images, category, stock, isActive } = req.body;

    product.name          = name          ?? product.name;
    product.description   = description   ?? product.description;
    product.price         = price         ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.images        = images        ?? product.images;
    product.category      = category      ?? product.category;
    product.stock         = stock         ?? product.stock;
    product.isActive      = isActive      ?? product.isActive;

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
