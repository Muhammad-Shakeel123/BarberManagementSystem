import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../constant.js';

const paymentSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  depositAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'stripe', 'paypal', 'other'],
    default: 'other',
  },
  transactionId: {
    type: String,
    sparse: true,
  },
  idempotencyKey: {
    type: String,
    unique: true,
    sparse: true,
  },
  webhookData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  refundId: {
    type: String,
    default: null,
  },
  refundAmount: {
    type: Number,
    default: 0,
  },
  refundReason: {
    type: String,
    maxlength: 200,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  paidAt: {
    type: Date,
    default: null,
  },
  refundedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
paymentSchema.index({ appointmentId: 1 });
paymentSchema.index({ customerId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ idempotencyKey: 1 });
paymentSchema.index({ status: 1 });

// Virtuals
paymentSchema.virtual('appointment', {
  ref: 'Appointment',
  localField: 'appointmentId',
  foreignField: '_id',
  justOne: true,
});

paymentSchema.virtual('customer', {
  ref: 'User',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

paymentSchema.set('toObject', { virtuals: true });
paymentSchema.set('toJSON', { virtuals: true });

// Instance methods
paymentSchema.methods.isPaid = function () {
  return this.status === PAYMENT_STATUS.PAID;
};

paymentSchema.methods.isRefundable = function () {
  return this.status === PAYMENT_STATUS.PAID && this.refundId === null;
};

export default mongoose.model('Payment', paymentSchema);