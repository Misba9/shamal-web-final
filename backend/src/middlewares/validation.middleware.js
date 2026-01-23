import { body, param, query, validationResult } from 'express-validator';

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg,
        })),
      });
    }
    next();
  };
};

// Login validation
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email too long'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 128 })
    .withMessage('Password too long'),
];

const uploadPath = (v) => typeof v === 'string' && /^\/uploads\/.+/.test(v);

// Project create (POST) validation
export const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((v) => v.length <= 50 && v.every((t) => typeof t === 'string'))
    .withMessage('Tags must have at most 50 strings'),
  body('category')
    .optional({ values: 'null' })
    .custom((v) => !v || v === '' || /^[a-fA-F0-9]{24}$/.test(v))
    .withMessage('Category must be a valid ObjectId'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
    .custom((v) => v.length <= 50 && v.every((u) => typeof u === 'string' && uploadPath(u)))
    .withMessage('Images must have at most 50 /uploads/ paths'),
  body('projectUrl')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Project URL cannot exceed 500 characters'),
  body('startDate')
    .optional({ values: 'null' })
    .custom((v) => v === '' || v == null || !isNaN(Date.parse(v)))
    .withMessage('startDate must be a valid date'),
  body('endDate')
    .optional({ values: 'null' })
    .custom((v) => v === '' || v == null || !isNaN(Date.parse(v)))
    .withMessage('endDate must be a valid date'),
];

// Project update (PUT) validation – all fields optional
export const validateProjectUpdate = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((v) => v.length <= 50 && v.every((t) => typeof t === 'string'))
    .withMessage('Tags must have at most 50 strings'),
  body('category')
    .optional({ values: 'null' })
    .custom((v) => !v || v === '' || /^[a-fA-F0-9]{24}$/.test(v))
    .withMessage('Category must be a valid ObjectId'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
    .custom((v) => v.length <= 50 && v.every((u) => typeof u === 'string' && uploadPath(u)))
    .withMessage('Images must have at most 50 /uploads/ paths'),
  body('projectUrl')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Project URL cannot exceed 500 characters'),
  body('startDate')
    .optional({ values: 'null' })
    .custom((v) => v === '' || v == null || !isNaN(Date.parse(v)))
    .withMessage('startDate must be a valid date'),
  body('endDate')
    .optional({ values: 'null' })
    .custom((v) => v === '' || v == null || !isNaN(Date.parse(v)))
    .withMessage('endDate must be a valid date'),
];

// Project list query (GET) validation
export const validateProjectListQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage('limit must be between 1 and 100'),
  query('category')
    .optional()
    .isMongoId()
    .withMessage('category must be a valid ObjectId'),
  query('archived')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('archived must be true or false'),
];

const BLOG_STATUS = ['draft', 'published'];

// Blog create (POST) validation
export const validateBlog = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 300 })
    .withMessage('Title must be between 1 and 300 characters'),
  body('slug')
    .optional({ values: 'null' })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be lowercase alphanumeric with hyphens')
    .isLength({ max: 300 })
    .withMessage('Slug cannot exceed 300 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 100000 })
    .withMessage('Content must be between 1 and 100000 characters'),
  body('featuredImage')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Featured image URL cannot exceed 1000 characters')
    .custom((v) => !v || /^https?:\/\//.test(v) || /^\/uploads\/.+/.test(v))
    .withMessage('Featured image must be a valid URL or /uploads/ path'),
  body('thumbnail')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Thumbnail URL cannot exceed 1000 characters')
    .custom((v) => !v || /^https?:\/\//.test(v) || /^\/uploads\/.+/.test(v))
    .withMessage('Thumbnail must be a valid URL or /uploads/ path'),
  body('status')
    .optional()
    .isIn(BLOG_STATUS)
    .withMessage('Status must be draft or published'),
  body('metaTitle')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 70 })
    .withMessage('Meta title should be under 70 characters'),
  body('metaDescription')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 160 })
    .withMessage('Meta description should be under 160 characters'),
  body('keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array')
    .custom((v) => v.length <= 20 && v.every((k) => typeof k === 'string'))
    .withMessage('Keywords must have at most 20 strings'),
  body('publishedAt')
    .optional({ values: 'null' })
    .custom((v) => v === '' || v == null || !isNaN(Date.parse(v)))
    .withMessage('publishedAt must be a valid date'),
];

// Blog update (PUT) validation – all optional
export const validateBlogUpdate = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 300 })
    .withMessage('Title must be between 1 and 300 characters'),
  body('slug')
    .optional({ values: 'null' })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be lowercase alphanumeric with hyphens')
    .isLength({ max: 300 })
    .withMessage('Slug cannot exceed 300 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100000 })
    .withMessage('Content must be between 1 and 100000 characters'),
  body('featuredImage')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 1000 })
    .custom((v) => !v || /^https?:\/\//.test(v) || /^\/uploads\/.+/.test(v))
    .withMessage('Featured image must be a valid URL or /uploads/ path'),
  body('thumbnail')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 1000 })
    .custom((v) => !v || /^https?:\/\//.test(v) || /^\/uploads\/.+/.test(v))
    .withMessage('Thumbnail must be a valid URL or /uploads/ path'),
  body('status')
    .optional()
    .isIn(BLOG_STATUS)
    .withMessage('Status must be draft or published'),
  body('metaTitle')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 70 })
    .withMessage('Meta title should be under 70 characters'),
  body('metaDescription')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 160 })
    .withMessage('Meta description should be under 160 characters'),
  body('keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array')
    .custom((v) => v.length <= 20 && v.every((k) => typeof k === 'string'))
    .withMessage('Keywords must have at most 20 strings'),
  body('publishedAt')
    .optional({ values: 'null' })
    .custom((v) => v === '' || v == null || !isNaN(Date.parse(v)))
    .withMessage('publishedAt must be a valid date'),
];

// Blog list query (GET) validation
export const validateBlogListQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage('limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('search cannot exceed 200 characters'),
  query('status')
    .optional()
    .isIn(BLOG_STATUS)
    .withMessage('status must be draft or published'),
];

// ObjectId validation
export const validateObjectId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

// Contact (public) validation
export const validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email too long'),
  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone too long'),
  body('subject')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 300 })
    .withMessage('Subject too long'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5000 characters'),
];

// Lead (admin create) validation
export const validateLead = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email too long'),
  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone too long'),
  body('subject')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 300 })
    .withMessage('Subject too long'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5000 characters'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'converted'])
    .withMessage('Status must be new, contacted, or converted'),
  body('source')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Source too long'),
];

// Newsletter subscribe (POST) – public
export const validateNewsletterSubscribe = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email too long'),
];

// Contact update (PATCH) – admin: read, status, internalNotes, emailNotify
export const validateContactUpdate = [
  body('read').optional().isBoolean().withMessage('read must be boolean'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'converted', 'read', 'replied'])
    .withMessage('Invalid status'),
  body('internalNotes')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Internal notes cannot exceed 5000 characters'),
  body('emailNotify').optional().isBoolean().withMessage('emailNotify must be boolean'),
];

// Lead update (admin PUT) – all fields optional
export const validateLeadUpdate = [
  body('status')
    .optional()
    .trim()
    .isIn(['new', 'contacted', 'converted'])
    .withMessage('Status must be new, contacted, or converted'),
  body('internalNotes')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Internal notes cannot exceed 5000 characters'),
  body('emailNotify')
    .optional({ values: 'null' })
    .isBoolean()
    .withMessage('emailNotify must be boolean'),
  body('name').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Name 1–200 characters'),
  body('email').optional().trim().isEmail().withMessage('Valid email required').isLength({ max: 255 }),
  body('phone').optional({ values: 'null' }).trim().isLength({ max: 50 }),
  body('message').optional().trim().isLength({ min: 1, max: 5000 }),
];
