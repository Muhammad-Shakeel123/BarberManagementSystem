import Joi from 'joi';

export const createChair = {
  body: Joi.object({
    branchId: Joi.string().required(),
    name: Joi.string().required(),
    number: Joi.number().required(),
    type: Joi.string().valid('hair', 'nail', 'spa', 'shave', 'general', 'other').default('general'),
    assignedBarberId: Joi.string().optional().allow(null),
    isShared: Joi.boolean().default(true),
    description: Joi.string().max(200).optional(),
  }),
};

export const updateChair = {
  body: Joi.object({
    name: Joi.string().optional(),
    type: Joi.string().valid('hair', 'nail', 'spa', 'shave', 'general', 'other').optional(),
    isOperational: Joi.boolean().optional(),
    assignedBarberId: Joi.string().optional().allow(null),
    isShared: Joi.boolean().optional(),
    description: Joi.string().max(200).optional(),
  }),
};

export default {
  createChair,
  updateChair,
};