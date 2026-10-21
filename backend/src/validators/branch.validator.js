import Joi from 'joi';

const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createBranch = {
  body: Joi.object({
    name: Joi.string().required(),
    code: Joi.string().uppercase().min(2).max(10).required(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().default('Pakistan'),
      zipCode: Joi.string().optional(),
      coordinates: Joi.object({
        lat: Joi.number().optional(),
        lng: Joi.number().optional(),
      }),
    }).optional(),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional(),
    timezone: Joi.string().default('Asia/Karachi'),
    workingHours: Joi.object({
      start: Joi.string().pattern(timePattern),
      end: Joi.string().pattern(timePattern),
      breaks: Joi.array().items(
        Joi.object({
          start: Joi.string().pattern(timePattern),
          end: Joi.string().pattern(timePattern),
        })
      ),
    }).optional(),
    capacity: Joi.object({
      totalChairs: Joi.number().min(1).default(5),
      totalBarbers: Joi.number().min(1).default(5),
    }).optional(),
    settings: Joi.object({
      allowWalkIn: Joi.boolean(),
      allowOnlineBooking: Joi.boolean(),
      maxDaysAdvance: Joi.number().min(1).max(90),
      minMinutesAdvance: Joi.number().min(5).max(1440),
      noShowGraceMinutes: Joi.number().min(0).max(120),
    }).optional(),
  }),
};

export const updateBranch = {
  body: Joi.object({
    name: Joi.string().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zipCode: Joi.string().optional(),
      coordinates: Joi.object({
        lat: Joi.number().optional(),
        lng: Joi.number().optional(),
      }),
    }).optional(),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional(),
    timezone: Joi.string().optional(),
    workingHours: Joi.object({
      start: Joi.string().pattern(timePattern),
      end: Joi.string().pattern(timePattern),
      breaks: Joi.array().items(
        Joi.object({
          start: Joi.string().pattern(timePattern),
          end: Joi.string().pattern(timePattern),
        })
      ),
    }).optional(),
    capacity: Joi.object({
      totalChairs: Joi.number().min(1),
      totalBarbers: Joi.number().min(1),
    }).optional(),
    isActive: Joi.boolean().optional(),
    settings: Joi.object({
      allowWalkIn: Joi.boolean(),
      allowOnlineBooking: Joi.boolean(),
      maxDaysAdvance: Joi.number().min(1).max(90),
      minMinutesAdvance: Joi.number().min(5).max(1440),
      noShowGraceMinutes: Joi.number().min(0).max(120),
    }).optional(),
  }),
};

export default {
  createBranch,
  updateBranch,
};