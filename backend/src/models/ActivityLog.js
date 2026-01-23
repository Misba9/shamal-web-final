import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      enum: ['create', 'update', 'delete', 'login', 'view'],
    },
    entity: {
      type: String,
      required: [true, 'Entity is required'],
      trim: true,
      enum: ['project', 'blog', 'user', 'lead', 'admin'],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Admin is required'],
    },
    details: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ adminId: 1, createdAt: -1 });

/**
 * Log an admin action. Call from controllers after create/update/delete.
 * @param {Object} p - { adminId, action, entity, entityId?, details? }
 */
activityLogSchema.statics.log = async function (p) {
  await this.create({
    adminId: p.adminId,
    action: p.action,
    entity: p.entity,
    entityId: p.entityId ?? null,
    details: p.details ?? '',
  });
};

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
