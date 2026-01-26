import mongoose from 'mongoose';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'job';
}

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];

const jobSchema = new mongoose.Schema(
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
    department: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Department cannot exceed 200 characters'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    employmentType: {
      type: String,
      enum: {
        values: EMPLOYMENT_TYPES,
        message: 'Employment type must be one of: ' + EMPLOYMENT_TYPES.join(', '),
      },
      default: 'Full-Time',
    },
    experience: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Experience cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.length <= 50,
        message: 'Requirements cannot exceed 50 items',
      },
    },
    responsibilities: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.length <= 50,
        message: 'Responsibilities cannot exceed 50 items',
      },
    },
    isActive: {
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
jobSchema.pre('save', async function (next) {
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

jobSchema.index({ isActive: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
