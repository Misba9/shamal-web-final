import Blog from '../models/Blog.js';

const BLOG_STATUS = ['draft', 'published'];

function safeTrim(s) {
  return s == null ? '' : String(s).trim();
}

function parseDate(v) {
  if (v == null || v === '') return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function isMongoDuplicate(err) {
  return err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000);
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const checkSlug = async (req, res, next) => {
  try {
    const slug = String(req.query.slug || '').trim().toLowerCase();
    const excludeId = req.query.excludeId || null;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug is required', available: false });
    }

    const filter = { slug };
    if (excludeId) filter._id = { $ne: excludeId };

    const exists = await Blog.exists(filter);
    res.status(200).json({ success: true, available: !exists });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const { title, slug, content, featuredImage, thumbnail, status, metaTitle, metaDescription, keywords, publishedAt } = req.body;

    const doc = {
      title: safeTrim(title),
      slug: slug ? safeTrim(slug).toLowerCase() : undefined,
      content: safeTrim(content),
      featuredImage: safeTrim(featuredImage) || safeTrim(thumbnail) || '',
      thumbnail: safeTrim(thumbnail) || safeTrim(featuredImage) || '',
      status: status && BLOG_STATUS.includes(status) ? status : 'draft',
      metaTitle: safeTrim(metaTitle) || '',
      metaDescription: safeTrim(metaDescription) || '',
      keywords: Array.isArray(keywords) ? keywords.filter((k) => typeof k === 'string').slice(0, 20) : [],
      publishedAt: parseDate(publishedAt),
    };

    const blog = await Blog.create(doc);
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    if (isMongoDuplicate(error)) {
      return res.status(409).json({ success: false, message: 'This slug is already in use. Please choose another.', field: 'slug' });
    }
    next(error);
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const search = String(req.query.search || '').trim();
    const status = req.query.status;
    const isAdmin = !!req.admin;

    const filter = {};
    if (isAdmin) {
      if (status && BLOG_STATUS.includes(status)) filter.status = status;
    } else {
      filter.status = 'published';
    }
    if (search) {
      const re = new RegExp(escapeRegex(search), 'i');
      filter.$or = [
        { title: re },
        { slug: re },
        { content: re },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Blog.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      count: data.length,
      data,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).select('-__v');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/:slugOrId – Public by slug (published only); by id when admin (any status).
 */
export const getBlogBySlugOrId = async (req, res, next) => {
  try {
    const slugOrId = String(req.params.slugOrId || '').trim();
    const isAdmin = !!req.admin;

    let blog = null;
    const isValidId = slugOrId.length === 24 && /^[a-f0-9A-F]{24}$/.test(slugOrId);

    if (isValidId) {
      blog = await Blog.findById(slugOrId).select('-__v').lean();
      if (blog && !isAdmin && blog.status !== 'published') {
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: slugOrId, status: 'published' }).select('-__v').lean();
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updateData = {};

    if (body.title !== undefined) updateData.title = safeTrim(body.title);
    if (body.slug !== undefined) updateData.slug = safeTrim(body.slug).toLowerCase();
    if (body.content !== undefined) updateData.content = safeTrim(body.content);
    if (body.featuredImage !== undefined) updateData.featuredImage = safeTrim(body.featuredImage);
    if (body.thumbnail !== undefined) updateData.thumbnail = safeTrim(body.thumbnail);
    if (body.status !== undefined && BLOG_STATUS.includes(body.status)) {
      updateData.status = body.status;
      updateData.published = body.status === 'published';
      if (body.status === 'published' && body.publishedAt === undefined) {
        updateData.publishedAt = new Date();
      }
    }
    if (body.publishedAt !== undefined) updateData.publishedAt = parseDate(body.publishedAt);
    if (body.metaTitle !== undefined) updateData.metaTitle = safeTrim(body.metaTitle);
    if (body.metaDescription !== undefined) updateData.metaDescription = safeTrim(body.metaDescription);
    if (body.keywords !== undefined) updateData.keywords = Array.isArray(body.keywords) ? body.keywords.filter((k) => typeof k === 'string').slice(0, 20) : [];

    const blog = await Blog.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select('-__v');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    if (isMongoDuplicate(error)) {
      return res.status(409).json({ success: false, message: 'This slug is already in use. Please choose another.', field: 'slug' });
    }
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id).select('-__v');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};
