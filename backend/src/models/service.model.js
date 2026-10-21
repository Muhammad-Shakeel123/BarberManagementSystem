import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [5, 'Duration must be at least 5 minutes'],
    max: [480, 'Duration cannot exceed 480 minutes (8 hours)'],
  },
  bufferAfter: {
    type: Number,
    default: 5,
    min: 0,
    max: 60,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  deposit: {
    type: Number,
    default: 0,
    min: 0,
  },
  isDepositRefundable: {
    type: Boolean,
    default: true,
  },
  chairTypeRequired: {
    type: String,
    enum: ['hair', 'nail', 'spa', 'shave', 'general', 'other', null],
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  branchIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  }],
  category: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  // For service combinations
  isCombo: {
    type: Boolean,
    default: false,
  },
  comboServiceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
}, {
  timestamps: true,
});

// Indexes
serviceSchema.index({ name: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ branchIds: 1 });

export default mongoose.model('Service', serviceSchema);