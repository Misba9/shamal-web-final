import mongoose from 'mongoose';
import Service from '../models/Service.js';

function safeTrim(s) {
  return s == null ? '' : String(s).trim();
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
 * POST /api/services/upload-image
 * Multipart form with 'image' (single file). Stores in /uploads/services.
 * Returns { success: true, url: string } (e.g. /uploads/services/xxx.jpg)
 */
export const handleUploadServiceImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }
    const url = `/uploads/services/${req.file.filename}`;
    res.status(200).json({
      success: true,
      url,
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { title, slug, shortDescription, description, icon, featuredImage, isActive, showOnHome, seoTitle, seoDescription, seoKeywords } = req.body;

    const doc = {
      title: safeTrim(title),
      slug: slug ? safeTrim(slug).toLowerCase() : undefined,
      shortDescription: safeTrim(shortDescription),
      description: safeTrim(description),
      icon: safeTrim(icon) || '',
      featuredImage: safeTrim(featuredImage) || '',
      isActive: parseBoolean(isActive) ?? true,
      showOnHome: parseBoolean(showOnHome) ?? true,
      seoTitle: safeTrim(seoTitle) || '',
      seoDescription: safeTrim(seoDescription) || '',
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords.filter((k) => typeof k === 'string').slice(0, 20) : [],
    };

    const service = await Service.create(doc);
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
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

export const getHomeServices = async (req, res, next) => {
  try {
    // Only active services with showOnHome = true
    const services = await Service.find({
      isActive: true,
      showOnHome: true,
    })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (req, res, next) => {
  try {
    const active = req.query.active;
    const home = req.query.home;
    const isAdmin = !!req.admin;

    const filter = {};
    
    // Public users only see active services
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

    const services = await Service.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isAdmin = !!req.admin;

    // Check if slug is actually an ObjectId (for admin edit)
    const isValidId = slug.length === 24 && /^[a-f0-9A-F]{24}$/.test(slug);
    
    let service = null;
    if (isValidId && isAdmin) {
      // Admin can get by ID
      service = await Service.findById(slug).select('-__v').lean();
    } else {
      // Get by slug
      const filter = { slug };
      if (!isAdmin) {
        filter.isActive = true;
      }
      service = await Service.findOne(filter).select('-__v').lean();
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format',
      });
    }

    const updateData = {};

    if (body.title !== undefined) updateData.title = safeTrim(body.title);
    if (body.slug !== undefined) updateData.slug = safeTrim(body.slug).toLowerCase();
    if (body.shortDescription !== undefined) updateData.shortDescription = safeTrim(body.shortDescription);
    if (body.description !== undefined) updateData.description = safeTrim(body.description);
    if (body.icon !== undefined) updateData.icon = safeTrim(body.icon);
    if (body.featuredImage !== undefined) updateData.featuredImage = safeTrim(body.featuredImage);
    if (body.isActive !== undefined) updateData.isActive = parseBoolean(body.isActive) ?? true;
    if (body.showOnHome !== undefined) updateData.showOnHome = parseBoolean(body.showOnHome) ?? true;
    if (body.seoTitle !== undefined) updateData.seoTitle = safeTrim(body.seoTitle);
    if (body.seoDescription !== undefined) updateData.seoDescription = safeTrim(body.seoDescription);
    if (body.seoKeywords !== undefined) updateData.seoKeywords = Array.isArray(body.seoKeywords) ? body.seoKeywords.filter((k) => typeof k === 'string').slice(0, 20) : [];

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
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

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format',
      });
    }

    // Soft delete: set isActive = false
    const service = await Service.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    ).select('-__v');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deactivated successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};
