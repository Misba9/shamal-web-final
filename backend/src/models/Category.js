import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
  },
  { timestamps: true, toJSON: { virtuals: false }, toObject: { virtuals: false } }
);

categorySchema.index({ name: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
