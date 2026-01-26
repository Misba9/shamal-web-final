import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Project from '../models/Project.js';

const DEFAULT_CATEGORIES = ['Infrastructure', 'Construction', 'Mining', 'Environmental', 'Marine'];

export const listCategories = async (req, res, next) => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES.map((name) => ({ name })));
    }

    const data = await Category.find().sort({ name: 1 }).select('_id name slug').lean();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Check for duplicate name (case-insensitive)
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error (name or slug)
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format',
      });
    }

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if category has linked projects
    const projectsCount = await Project.countDocuments({ category: id });
    if (projectsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is linked to ${projectsCount} project${projectsCount !== 1 ? 's' : ''}. Please remove or reassign projects first.`,
      });
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
