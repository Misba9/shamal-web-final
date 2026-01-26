import mongoose from 'mongoose';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'service';
}

const serviceSchema = new mongoose.Schema(
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
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Icon URL cannot exceed 1000 characters'],
    },
    featuredImage: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Featured image URL cannot exceed 1000 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showOnHome: {
      type: Boolean,
      default: true,
    },
    // SEO Fields
    seoTitle: {
      type: String,
      trim: true,
      default: '',
      maxlength: [70, 'SEO title should be under 70 characters for SEO'],
    },
    seoDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [160, 'SEO description should be under 160 characters for SEO'],
    },
    seoKeywords: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.length <= 20,
        message: 'SEO keywords cannot exceed 20 items',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

// Auto-generate slug from title when slug is empty
serviceSchema.pre('save', async function (next) {
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
    next();
  } catch (err) {
    next(err);
  }
});

serviceSchema.index({ isActive: 1 });
serviceSchema.index({ showOnHome: 1 });
serviceSchema.index({ createdAt: -1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
