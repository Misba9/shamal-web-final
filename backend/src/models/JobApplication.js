import mongoose from 'mongoose';

const APPLICATION_STATUS = ['New', 'Reviewed', 'Shortlisted', 'Rejected'];

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [300, 'Job title cannot exceed 300 characters'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [200, 'Full name cannot exceed 200 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [255, 'Email cannot exceed 255 characters'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      maxlength: [50, 'Phone cannot exceed 50 characters'],
    },
    coverLetter: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Cover letter cannot exceed 5000 characters'],
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
      trim: true,
      maxlength: [1000, 'Resume URL cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUS,
        message: 'Status must be one of: ' + APPLICATION_STATUS.join(', '),
      },
      default: 'New',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

jobApplicationSchema.index({ jobId: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ createdAt: -1 });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
