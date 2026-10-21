import Joi from 'joi';

const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createBarber = {
  body: Joi.object({
    userId: Joi.string().required(),
    branchId: Joi.string().required(),
    branches: Joi.array().items(Joi.string()).optional(),
    specialties: Joi.array().items(Joi.string()).optional(),
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
    qualification: Joi.string().max(500).optional(),
    experienceYears: Joi.number().min(0).max(50).optional(),
    bio: Joi.string().max(1000).optional(),
  }),
};

export const updateBarber = {
  body: Joi.object({
    branchId: Joi.string().optional(),
    branches: Joi.array().items(Joi.string()).optional(),
    specialties: Joi.array().items(Joi.string()).optional(),
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
    isActive: Joi.boolean().optional(),
    qualification: Joi.string().max(500).optional(),
    experienceYears: Joi.number().min(0).max(50).optional(),
    bio: Joi.string().max(1000).optional(),
  }),
};

export default {
  createBarber,
  updateBarber,
};