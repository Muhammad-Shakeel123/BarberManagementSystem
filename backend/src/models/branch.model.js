import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 2,
    maxlength: 10,
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Pakistan' },
    zipCode: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
location: {
  type: {
    type: String,
    enum: ["Point"],
  },
  coordinates: {
    type: [Number],
  },
},
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  timezone: {
    type: String,
    default: 'Asia/Karachi',
  },
  workingHours: {
    start: {
      type: String,
      default: '09:00',
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
    },
    end: {
      type: String,
      default: '21:00',
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
    },
    breaks: [{
      start: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
      },
      end: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
      },
    }],
  },
  offDates: [{
    type: Date,
  }],
  capacity: {
    totalChairs: {
      type: Number,
      default: 5,
      min: 1,
    },
    totalBarbers: {
      type: Number,
      default: 5,
      min: 1,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  settings: {
    allowWalkIn: { type: Boolean, default: true },
    allowOnlineBooking: { type: Boolean, default: true },
    maxDaysAdvance: { type: Number, default: 30 },
    minMinutesAdvance: { type: Number, default: 30 },
    noShowGraceMinutes: { type: Number, default: 15 },
  },
  logo: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
branchSchema.index({ code: 1 });
branchSchema.index({ isActive: 1 });
branchSchema.index({ 'address.city': 1 });
branchSchema.index({ location: "2dsphere" });

export default mongoose.model('Branch', branchSchema);