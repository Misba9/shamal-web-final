import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.length <= 50,
        message: 'Tags cannot exceed 50 items',
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.length <= 50,
        message: 'Images cannot exceed 50 items',
      },
    },
    projectUrl: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Project URL cannot exceed 500 characters'],
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

projectSchema.index({ createdAt: -1 });
projectSchema.index({ category: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ archived: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
