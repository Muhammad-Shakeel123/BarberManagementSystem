import Joi from 'joi';

export const bookAppointment = {
  body: Joi.object({
    branchId: Joi.string().required(),
    barberId: Joi.string().optional(),
    serviceIds: Joi.array().items(Joi.string()).min(1).required(),
    startTime: Joi.date().iso().required(),
    chairId: Joi.string().optional(),
    notes: Joi.string().max(500).optional(),
  }),
};

export const reschedule = {
  body: Joi.object({
    newStartTime: Joi.date().iso().required(),
    reason: Joi.string().max(200).optional(),
  }),
};

export const updateStatus = {
  body: Joi.object({
    status: Joi.string().valid('confirmed', 'in_progress', 'completed', 'cancelled', 'no_show').required(),
  }),
};

export const addExtraService = {
  body: Joi.object({
    serviceId: Joi.string().required(),
  }),
};

export default {
  bookAppointment,
  reschedule,
  updateStatus,
  addExtraService,
};