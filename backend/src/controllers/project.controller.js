import mongoose from 'mongoose';
import Project from '../models/Project.js';
// Ensure Category is registered so populate('category', 'name') does not throw MissingSchemaError.
import '../models/Category.js';

function safeTrim(s) {
  return s == null ? '' : String(s).trim();
}

function parseDate(v) {
  if (v == null || v === '') return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * POST /api/projects/upload-images
 * Multipart form with 'images' (array of files). Stores in /uploads/projects.
 * Returns { paths: string[] } (e.g. /uploads/projects/xxx.jpg)
 */
export const handleUploadProjectImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided',
      });
    }
    const paths = req.files.map((f) => `/uploads/projects/${f.filename}`);
    res.status(200).json({
      success: true,
      data: { paths },
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    // Log complete request body
    console.log('[CREATE PROJECT] Full req.body:', JSON.stringify(req.body, null, 2));
    console.log('[CREATE PROJECT] req.body.category:', req.body.category);
    console.log('[CREATE PROJECT] req.body.category type:', typeof req.body.category);
    
    let { title, description, tags, category, images, projectUrl, startDate, endDate } = req.body;

    // Parse tags if it's a JSON string (from FormData)
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        tags = [];
      }
    }

    // Parse images if it's a JSON string (from FormData)
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch (e) {
        images = [];
      }
    }

    // Ensure category exists and is valid ObjectId
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      console.error('[CREATE PROJECT] Invalid category ID:', category);
      throw new Error("Invalid category ID");
    }

    // If category is empty string, null, or undefined, set to null
    if (!category || category === '' || category === 'null') {
      category = null;
    }

    console.log('[CREATE PROJECT] Final category value:', category);
    console.log('[CREATE PROJECT] Category type:', typeof category);

    const project = await Project.create({
      title: safeTrim(title),
      description: safeTrim(description),
      tags: Array.isArray(tags) ? tags.filter((t) => typeof t === 'string').slice(0, 50) : [],
      category,
      images: Array.isArray(images) ? images.filter((u) => typeof u === 'string').slice(0, 50) : [],
      projectUrl: safeTrim(projectUrl),
      startDate: parseDate(startDate),
      endDate: parseDate(endDate),
    });

    console.log('[CREATE PROJECT] Project created with category:', project.category);

    // Populate category for response
    const populated = await Project.findById(project._id)
      .populate('category', '_id name')
      .select('-__v')
      .lean();

    console.log('[CREATE PROJECT] Populated category:', populated?.category);

    res.status(201).json({
      success: true,
      data: populated
    });

  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    // 1) Parse pagination - page and limit are optional, provide defaults
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;
    
    // Validate and sanitize pagination
    const safePage = Number.isInteger(page) && page >= 1 ? page : 1;
    const safeLimit = Number.isInteger(limit) && limit >= 1 && limit <= 100 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    // 2) Build filter - public users see only non-archived projects
    const isAdmin = !!req.admin;
    const filter = {};
    
    // Category filter (optional query param)
    if (req.query?.category) {
      const categoryId = String(req.query.category).trim();
      if (mongoose.Types.ObjectId.isValid(categoryId)) {
        filter.category = categoryId;
      }
    }
    
    // Archived filter
    if (isAdmin) {
      // Admin can filter by archived status
      if (req.query?.archived === 'true') {
        filter.archived = true;
      } else if (req.query?.archived === 'false') {
        filter.archived = false;
      } else {
        // Default: show non-archived
        filter.archived = { $ne: true };
      }
    } else {
      // Public: always exclude archived
      filter.archived = { $ne: true };
    }

    // 3) Verify Project model is available
    if (!Project || typeof Project.find !== 'function') {
      console.error('[getAllProjects] Project model not available');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // 4) Execute MongoDB queries with defensive error handling
    let projects = [];
    let total = 0;
    
    try {
      // Build base query with populate
      const baseQuery = Project.find(filter)
        .select('-__v')
        .populate('category', '_id name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean();
      
      // Execute queries
      [projects, total] = await Promise.all([
        baseQuery.exec().catch((queryError) => {
          console.error('[getAllProjects] Query execution error:', queryError?.message);
          // If query fails, try without populate
          return Project.find(filter)
            .select('-__v')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .lean()
            .exec();
        }),
        Project.countDocuments(filter).exec().catch((countError) => {
          console.error('[getAllProjects] Count error:', countError?.message);
          return 0; // Return 0 if count fails
        })
      ]);
      
      // Ensure projects is an array
      if (!Array.isArray(projects)) {
        console.warn('[getAllProjects] Projects is not an array, setting to empty array');
        projects = [];
      }
      
      // Ensure total is a number
      if (!Number.isInteger(total) || total < 0) {
        total = 0;
      }
    } catch (dbError) {
      console.error('[getAllProjects] Database query error:', dbError);
      console.error('[getAllProjects] Error details:', {
        name: dbError?.name,
        code: dbError?.code,
        message: dbError?.message,
        stack: dbError?.stack
      });
      // Don't throw - return empty results instead
      projects = [];
      total = 0;
    }

    // 5) Normalize data - ensure projects is always an array and category is properly formatted
    const data = Array.isArray(projects) ? projects.map((project) => {
      // Normalize category: handle all possible cases
      let normalizedCategory = null;
      
      if (project.category) {
        if (typeof project.category === 'object' && project.category !== null) {
          // Check if it's a properly populated category object
          if (project.category._id && project.category.name) {
            // Valid populated category: { _id: "...", name: "..." }
            normalizedCategory = {
              _id: project.category._id,
              name: project.category.name
            };
          } else if (project.category._id) {
            // Has _id but no name (populate failed) - set to null
            console.warn(`[getAllProjects] Project ${project._id} has category with _id but no name`);
            normalizedCategory = null;
          } else {
            // Invalid object format - set to null
            console.warn(`[getAllProjects] Project ${project._id} has invalid category object format`);
            normalizedCategory = null;
          }
        } else if (typeof project.category === 'string') {
          // Invalid: category is a string instead of ObjectId - set to null
          console.warn(`[getAllProjects] Project ${project._id} has invalid category string: ${project.category}. Setting to null.`);
          normalizedCategory = null;
        } else {
          // Other invalid type - set to null
          normalizedCategory = null;
        }
      }
      // category is null or undefined - that's fine, keep as null
      
      // Log category structure for debugging
      if (normalizedCategory) {
        console.log(`[getAllProjects] Project ${project._id} category:`, {
          _id: normalizedCategory._id,
          name: normalizedCategory.name,
          _idType: typeof normalizedCategory._id,
          _idString: String(normalizedCategory._id)
        });
      }
      
      return {
        ...project,
        category: normalizedCategory
      };
    }) : [];
    const totalCount = Number.isInteger(total) && total >= 0 ? total : 0;
    const totalPages = safeLimit > 0 ? Math.max(1, Math.ceil(totalCount / safeLimit)) : 1;

    // 6) Return success response (even if empty array)
    return res.status(200).json({
      success: true,
      data: data,
      total: totalCount,
      page: safePage,
      limit: safeLimit,
      count: data.length,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: totalCount,
        totalPages: totalPages
      }
    });
  } catch (error) {
    // Log the actual error for debugging
    console.error('[getAllProjects] Error:', error);
    console.error('[getAllProjects] Error name:', error?.name);
    console.error('[getAllProjects] Error message:', error?.message);
    console.error('[getAllProjects] Error stack:', error?.stack);
    console.error('[getAllProjects] Request query:', req.query);
    console.error('[getAllProjects] Request URL:', req.url);
    
    // Always return JSON response, never crash
    return res.status(500).json({
      success: false,
      message: error?.message || 'Internal server error'
    });
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const { id } = req.params;
    const isAdmin = !!req.admin;

    let project = await Project.findById(id)
      .populate({
        path: 'category',
        select: '_id name',
        options: { strictPopulate: false }
      })
      .select('-__v')
      .lean();
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!isAdmin && project.archived) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Normalize category
    if (project.category) {
      if (typeof project.category === 'object' && project.category !== null && project.category._id && project.category.name) {
        // Valid populated category - keep as is
        project.category = {
          _id: project.category._id,
          name: project.category.name
        };
      } else {
        // Invalid category - set to null
        console.warn(`[getProjectById] Project ${id} has invalid category, setting to null`);
        project.category = null;
      }
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('[getProjectById] Error:', error);
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    
    const { id } = req.params;
    const body = req.body;
    
    console.log('[UPDATE PROJECT] Full req.body:', JSON.stringify(body, null, 2));
    console.log('[UPDATE PROJECT] req.body.category:', body.category);
    console.log('[UPDATE PROJECT] req.body.category type:', typeof body.category);
    
    let { category, ...rest } = body;

    // Parse tags if it's a JSON string (from FormData)
    if (body.tags !== undefined && typeof body.tags === 'string') {
      try {
        body.tags = JSON.parse(body.tags);
      } catch (e) {
        body.tags = [];
      }
    }

    // Parse images if it's a JSON string (from FormData)
    if (body.images !== undefined && typeof body.images === 'string') {
      try {
        body.images = JSON.parse(body.images);
      } catch (e) {
        body.images = [];
      }
    }

    // Validate category ObjectId - if provided, must be valid
    if (category !== undefined && category !== null && category !== '') {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        console.error('[UPDATE PROJECT] Invalid category ID:', category);
        throw new Error("Invalid category ID");
      }
    } else {
      // Empty string, null, or undefined means no category
      category = null;
    }

    console.log('[UPDATE PROJECT] Final category value:', category);

    // Build update data with category explicitly set
    const updateData = {};
    
    // Handle all fields
    if (body.title !== undefined) updateData.title = safeTrim(body.title);
    if (body.description !== undefined) updateData.description = safeTrim(body.description);
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? body.tags.filter((t) => typeof t === 'string').slice(0, 50) : [];
    if (body.images !== undefined) updateData.images = Array.isArray(body.images) ? body.images.filter((u) => typeof u === 'string').slice(0, 50) : [];
    if (body.projectUrl !== undefined) updateData.projectUrl = safeTrim(body.projectUrl);
    if (body.startDate !== undefined) updateData.startDate = parseDate(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = parseDate(body.endDate);
    
    // Explicitly set category (required - don't skip this)
    updateData.category = category;

    console.log('[UPDATE PROJECT] Update data with category:', updateData.category);

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('category', '_id name')
      .select('-__v')
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    console.log('[UPDATE PROJECT] Project updated with category:', project.category);

    res.json({ success: true, data: project });

  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id).select('-__v');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};
