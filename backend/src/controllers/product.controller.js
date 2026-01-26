import mongoose from 'mongoose';
import Product from '../models/Product.js';

function safeTrim(s) {
  return s == null ? '' : String(s).trim();
}

function parseNumber(v) {
  if (v == null || v === '' || v === 'null' || v === 'undefined') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function parseBoolean(v) {
  if (v === 'true' || v === true) return true;
  if (v === 'false' || v === false) return false;
  return null;
}

function isMongoDuplicate(err) {
  return err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000);
}

/**
 * POST /api/products/upload-image
 * Multipart form with 'image' (single file). Stores in /uploads/products.
 * Returns { success: true, url: string } (e.g. /uploads/products/xxx.jpg)
 */
export const handleUploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }
    const url = `/uploads/products/${req.file.filename}`;
    res.status(200).json({
      success: true,
      url,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, slug, shortDescription, description, image, price, isActive, showOnHome, order } = req.body;

    const doc = {
      name: safeTrim(name),
      slug: slug ? safeTrim(slug).toLowerCase() : undefined,
      shortDescription: safeTrim(shortDescription) || '',
      description: safeTrim(description) || '',
      image: safeTrim(image) || '',
      price: parseNumber(price),
      isActive: parseBoolean(isActive) ?? true,
      showOnHome: parseBoolean(showOnHome) ?? true,
      order: parseNumber(order) ?? 0,
    };

    const product = await Product.create(doc);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    if (isMongoDuplicate(error)) {
      return res.status(409).json({ 
        success: false, 
        message: 'This slug is already in use. Please choose another.', 
        field: 'slug' 
      });
    }
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const active = req.query.active;
    const home = req.query.home;
    const isAdmin = !!req.admin;

    const filter = {};
    
    // Public users only see active products
    if (!isAdmin) {
      filter.isActive = true;
    } else if (active === 'true') {
      filter.isActive = true;
    } else if (active === 'false') {
      filter.isActive = false;
    }

    // Filter by showOnHome
    if (home === 'true') {
      filter.showOnHome = true;
    } else if (home === 'false') {
      filter.showOnHome = false;
    }

    const products = await Product.find(filter)
      .select('-__v')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isAdmin = !!req.admin;

    // Check if slug is actually an ObjectId (for admin edit)
    const isValidId = slug.length === 24 && /^[a-f0-9A-F]{24}$/.test(slug);
    
    let product = null;
    if (isValidId && isAdmin) {
      // Admin can get by ID
      product = await Product.findById(slug).select('-__v').lean();
    } else {
      // Get by slug
      const filter = { slug };
      if (!isAdmin) {
        filter.isActive = true;
      }
      product = await Product.findOne(filter).select('-__v').lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const updateData = {};

    if (body.name !== undefined) updateData.name = safeTrim(body.name);
    if (body.slug !== undefined) updateData.slug = safeTrim(body.slug).toLowerCase();
    if (body.shortDescription !== undefined) updateData.shortDescription = safeTrim(body.shortDescription);
    if (body.description !== undefined) updateData.description = safeTrim(body.description);
    if (body.image !== undefined) updateData.image = safeTrim(body.image);
    if (body.price !== undefined) updateData.price = parseNumber(body.price);
    if (body.isActive !== undefined) updateData.isActive = parseBoolean(body.isActive) ?? true;
    if (body.showOnHome !== undefined) updateData.showOnHome = parseBoolean(body.showOnHome) ?? true;
    if (body.order !== undefined) updateData.order = parseNumber(body.order) ?? 0;

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    if (isMongoDuplicate(error)) {
      return res.status(409).json({ 
        success: false, 
        message: 'This slug is already in use. Please choose another.', 
        field: 'slug' 
      });
    }
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const product = await Product.findByIdAndDelete(id).select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
