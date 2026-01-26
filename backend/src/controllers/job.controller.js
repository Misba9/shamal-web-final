import mongoose from 'mongoose';
import Job from '../models/Job.js';

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

export const createJob = async (req, res, next) => {
  try {
    const { title, slug, department, location, employmentType, experience, description, requirements, responsibilities, isActive, seoTitle, seoDescription, seoKeywords } = req.body;

    const doc = {
      title: safeTrim(title),
      slug: slug ? safeTrim(slug).toLowerCase() : undefined,
      department: safeTrim(department) || '',
      location: safeTrim(location) || '',
      employmentType: employmentType || 'Full-Time',
      experience: safeTrim(experience) || '',
      description: safeTrim(description),
      requirements: Array.isArray(requirements) ? requirements.filter((r) => typeof r === 'string').slice(0, 50) : [],
      responsibilities: Array.isArray(responsibilities) ? responsibilities.filter((r) => typeof r === 'string').slice(0, 50) : [],
      isActive: parseBoolean(isActive) ?? true,
      seoTitle: safeTrim(seoTitle) || '',
      seoDescription: safeTrim(seoDescription) || '',
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords.filter((k) => typeof k === 'string').slice(0, 20) : [],
    };

    const job = await Job.create(doc);
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
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

export const getAllJobs = async (req, res, next) => {
  try {
    const isAdmin = !!req.admin;
    const active = req.query.active;

    const filter = {};
    
    // Public users only see active jobs
    if (!isAdmin) {
      filter.isActive = true;
    } else if (active === 'true') {
      filter.isActive = true;
    } else if (active === 'false') {
      filter.isActive = false;
    }

    const jobs = await Job.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isAdmin = !!req.admin;

    // Check if slug is actually an ObjectId (for admin edit)
    const isValidId = slug.length === 24 && /^[a-f0-9A-F]{24}$/.test(slug);
    
    let job = null;
    if (isValidId && isAdmin) {
      // Admin can get by ID
      job = await Job.findById(slug).select('-__v').lean();
    } else {
      // Get by slug
      const filter = { slug };
      if (!isAdmin) {
        filter.isActive = true;
      }
      job = await Job.findOne(filter).select('-__v').lean();
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format',
      });
    }

    const updateData = {};

    if (body.title !== undefined) updateData.title = safeTrim(body.title);
    if (body.slug !== undefined) updateData.slug = safeTrim(body.slug).toLowerCase();
    if (body.department !== undefined) updateData.department = safeTrim(body.department);
    if (body.location !== undefined) updateData.location = safeTrim(body.location);
    if (body.employmentType !== undefined) updateData.employmentType = body.employmentType;
    if (body.experience !== undefined) updateData.experience = safeTrim(body.experience);
    if (body.description !== undefined) updateData.description = safeTrim(body.description);
    if (body.requirements !== undefined) updateData.requirements = Array.isArray(body.requirements) ? body.requirements.filter((r) => typeof r === 'string').slice(0, 50) : [];
    if (body.responsibilities !== undefined) updateData.responsibilities = Array.isArray(body.responsibilities) ? body.responsibilities.filter((r) => typeof r === 'string').slice(0, 50) : [];
    if (body.isActive !== undefined) updateData.isActive = parseBoolean(body.isActive) ?? true;
    if (body.seoTitle !== undefined) updateData.seoTitle = safeTrim(body.seoTitle);
    if (body.seoDescription !== undefined) updateData.seoDescription = safeTrim(body.seoDescription);
    if (body.seoKeywords !== undefined) updateData.seoKeywords = Array.isArray(body.seoKeywords) ? body.seoKeywords.filter((k) => typeof k === 'string').slice(0, 20) : [];

    const job = await Job.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
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

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format',
      });
    }

    // Soft delete: set isActive = false
    const job = await Job.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    ).select('-__v');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deactivated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
