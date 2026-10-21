import mongoose from 'mongoose';

const barberProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  // Multi-branch support - if barber works in multiple branches
  branches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  }],
  // Specialties (service IDs this barber can perform)
  specialties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
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
  isActive: {
    type: Boolean,
    default: true,
  },
  qualification: {
    type: String,
    maxlength: 500,
  },
  experienceYears: {
    type: Number,
    min: 0,
    max: 50,
  },
  bio: {
    type: String,
    maxlength: 1000,
  },
}, {
  timestamps: true,
});

// Indexes
barberProfileSchema.index({ branchId: 1, isActive: 1 });
barberProfileSchema.index({ userId: 1 });
barberProfileSchema.index({ specialties: 1 });

// Virtual for full name (populated from User)
barberProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

barberProfileSchema.set('toObject', { virtuals: true });
barberProfileSchema.set('toJSON', { virtuals: true });

export default mongoose.model('BarberProfile', barberProfileSchema);