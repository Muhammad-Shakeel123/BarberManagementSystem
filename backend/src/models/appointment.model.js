import mongoose from "mongoose";
import { APPOINTMENT_STATUS } from "../constant.js";

const appointmentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarberProfile",
      default: null,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    chairId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chair",
      default: null,
    },
    serviceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.BOOKED,
    },
    // Actual times for tracking
    actualStartTime: {
      type: Date,
      default: null,
    },
    actualEndTime: {
      type: Date,
      default: null,
    },
    // Reschedule tracking
    originalStartTime: {
      type: Date,
      default: null,
    },
    rescheduleHistory: [
      {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
        reason: { type: String, maxlength: 200 },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    // Walk-in flag
    isWalkIn: {
      type: Boolean,
      default: false,
    },
    queuePosition: {
      type: Number,
      default: null,
    },
    // Payment
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    depositPaid: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Notes
    notes: {
      type: String,
      maxlength: 500,
    },
    // Optimistic locking for concurrency
    __v: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Critical indexes for conflict detection and performance
appointmentSchema.index({ barberId: 1, startTime: 1, endTime: 1 });
appointmentSchema.index({ chairId: 1, startTime: 1, endTime: 1 });
appointmentSchema.index({ branchId: 1, startTime: 1, endTime: 1 });
appointmentSchema.index({ customerId: 1, startTime: 1 });
appointmentSchema.index({ status: 1, startTime: 1 });
appointmentSchema.index({ startTime: 1, status: 1 });
appointmentSchema.index({ endTime: 1, status: 1 });

// Virtuals
appointmentSchema.virtual("customer", {
  ref: "User",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

appointmentSchema.virtual("barber", {
  ref: "BarberProfile",
  localField: "barberId",
  foreignField: "_id",
  justOne: true,
});

appointmentSchema.virtual("branch", {
  ref: "Branch",
  localField: "branchId",
  foreignField: "_id",
  justOne: true,
});

appointmentSchema.virtual("chair", {
  ref: "Chair",
  localField: "chairId",
  foreignField: "_id",
  justOne: true,
});

appointmentSchema.virtual("services", {
  ref: "Service",
  localField: "serviceIds",
  foreignField: "_id",
});

appointmentSchema.set("toObject", { virtuals: true });
appointmentSchema.set("toJSON", { virtuals: true });

// Instance methods
appointmentSchema.methods.isActive = function () {
  return !["cancelled", "no_show", "completed"].includes(this.status);
};

appointmentSchema.methods.isEditable = function () {
  return ["booked", "confirmed"].includes(this.status);
};

export default mongoose.model("Appointment", appointmentSchema);
