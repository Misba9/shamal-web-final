import mongoose from 'mongoose';

/** ContactLead: name, email, phone, message, status (new|contacted|converted), internalNotes, createdAt. */
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
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
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'read', 'replied'], // read/replied kept for backward compat; map to contacted/converted in API
      default: 'new',
    },
    internalNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Internal notes cannot exceed 5000 characters'],
    },
    /** When true, allow email notifications to this lead (e.g. on status change). */
    emailNotify: {
      type: Boolean,
      default: true,
    },
    // Backward compatibility
    subject: { type: String, trim: true, default: '', maxlength: 300 },
    source: { type: String, trim: true, default: 'website', maxlength: 100 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text', message: 'text' });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
