import Joi from 'joi';

const chairTypes = ['hair', 'nail', 'spa', 'shave', 'general', 'other', null];

export const createService = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().max(500).optional(),
    duration: Joi.number().min(5).max(480).required(),
    bufferAfter: Joi.number().min(0).max(60).default(5),
    price: Joi.number().min(0).required(),
    deposit: Joi.number().min(0).default(0),
    isDepositRefundable: Joi.boolean().default(true),
    chairTypeRequired: Joi.string().valid(...chairTypes).default(null),
    branchIds: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().optional(),
    isCombo: Joi.boolean().default(false),
    comboServiceIds: Joi.array().items(Joi.string()).optional(),
  }),
};

export const updateService = {
  body: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().max(500).optional(),
    duration: Joi.number().min(5).max(480).optional(),
    bufferAfter: Joi.number().min(0).max(60).optional(),
    price: Joi.number().min(0).optional(),
    deposit: Joi.number().min(0).optional(),
    isDepositRefundable: Joi.boolean().optional(),
    chairTypeRequired: Joi.string().valid(...chairTypes).optional(),
    branchIds: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
    category: Joi.string().optional(),
    isCombo: Joi.boolean().optional(),
    comboServiceIds: Joi.array().items(Joi.string()).optional(),
  }),
};

export default {
  createService,
  updateService,
};