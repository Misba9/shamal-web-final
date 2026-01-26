import mongoose from 'mongoose';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'product';
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: [200, 'Slug cannot exceed 200 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    image: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Image URL cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      default: null,
      min: [0, 'Price cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showOnHome: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

// Auto-generate slug from name when slug is empty
productSchema.pre('save', async function (next) {
  try {
    const raw = String(this.slug || '').trim();
    if (!raw) {
      let base = slugify(this.name);
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

productSchema.index({ isActive: 1 });
productSchema.index({ showOnHome: 1 });
productSchema.index({ order: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
