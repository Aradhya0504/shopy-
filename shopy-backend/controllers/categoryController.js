const Category = require('../models/category.js');

// ── @desc    Get all categories
// ── @route   GET /api/categories
// ── @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get single category
// ── @route   GET /api/categories/:id
// ── @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: '❌ Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Create a category
// ── @route   POST /api/categories
// ── @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: '❌ Category name is required' });
    }

    // Check if category already exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: '❌ Category already exists' });
    }

    const category = await Category.create({ name, description, image });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update a category
// ── @route   PUT /api/categories/:id
// ── @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: '❌ Category not found' });
    }

    category.name        = req.body.name        || category.name;
    category.description = req.body.description || category.description;
    category.image       = req.body.image       || category.image;
    category.isActive    = req.body.isActive    ?? category.isActive;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Delete a category
// ── @route   DELETE /api/categories/:id
// ── @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: '❌ Category not found' });
    }

    await category.deleteOne();
    res.status(200).json({ message: '✅ Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
