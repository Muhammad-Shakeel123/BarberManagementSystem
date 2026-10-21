import mongoose from "mongoose";
import { QUEUE_STATUS } from "../constant.js";

const queueSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedBarberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarberProfile",
      default: null,
    },
    serviceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(QUEUE_STATUS),
      default: QUEUE_STATUS.WAITING,
    },
    position: {
      type: Number,
      required: true,
    },
    estimatedWaitTime: {
      type: Number,
      default: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      maxlength: 200,
    },
    // Priority: higher number = higher priority
    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes

// Fast queue lookup and ordering
queueSchema.index({
  branchId: 1,
  status: 1,
  priority: -1,
  joinedAt: 1,
});

// Fast customer queue lookup
queueSchema.index({
  customerId: 1,
  branchId: 1,
  status: 1,
});

// A customer can have only one WAITING entry
// in the same branch.
//
// Once the entry becomes COMPLETED or CANCELLED,
// the customer can join the queue again.
queueSchema.index(
  {
    branchId: 1,
    customerId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: QUEUE_STATUS.WAITING,
    },
  },
);

// Virtuals
queueSchema.virtual("customer", {
  ref: "User",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

queueSchema.virtual("requestedBarber", {
  ref: "BarberProfile",
  localField: "requestedBarberId",
  foreignField: "_id",
  justOne: true,
});

queueSchema.set("toObject", { virtuals: true });
queueSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Queue", queueSchema);
