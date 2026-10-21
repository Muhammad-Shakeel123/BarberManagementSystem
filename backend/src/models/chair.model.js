import mongoose from 'mongoose';

const chairSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Chair name is required'],
    trim: true,
  },
  number: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['hair', 'nail', 'spa', 'shave', 'general', 'other'],
    default: 'general',
  },
  isOperational: {
    type: Boolean,
    default: true,
  },
  assignedBarberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarberProfile',
    default: null,
  },
  isShared: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    maxlength: 200,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique chair number per branch
chairSchema.index({ branchId: 1, number: 1 }, { unique: true });
chairSchema.index({ branchId: 1, isOperational: 1 });
chairSchema.index({ assignedBarberId: 1 });

export default mongoose.model('Chair', chairSchema);