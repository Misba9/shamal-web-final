import mongoose from 'mongoose';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'post';
}

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: [300, 'Slug cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    featuredImage: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Featured image URL cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: 'Status must be draft or published',
      },
      default: 'draft',
    },
    // SEO – optional
    metaTitle: {
      type: String,
      trim: true,
      default: '',
      maxlength: [70, 'Meta title should be under 70 characters for SEO'],
    },
    metaDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [160, 'Meta description should be under 160 characters for SEO'],
    },
    keywords: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.length <= 20,
        message: 'Keywords cannot exceed 20 items',
      },
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    // Backward compatibility with existing documents
    thumbnail: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Thumbnail URL cannot exceed 1000 characters'],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

// Auto-generate slug from title when slug is empty
blogSchema.pre('save', async function (next) {
  try {
    const raw = String(this.slug || '').trim();
    if (!raw) {
      let base = slugify(this.title);
      const Model = this.constructor;
      let slug = base;
      let n = 1;
      while (await Model.findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${base}-${n++}`;
      }
      this.slug = slug;
    } else {
      this.slug = raw.toLowerCase();
    }

    // Sync published flag from status for backward compatibility
    this.published = this.status === 'published';

    // Set publishedAt when status becomes published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
    next();
  } catch (err) {
    next(err);
  }
});

blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ publishedAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
