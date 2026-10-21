import Joi from "joi";

export const updateUser = {
  body: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .optional(),
    role: Joi.string().valid("customer", "barber", "admin").optional(),
    isActive: Joi.boolean().optional(),
    preferences: Joi.object({
      notifications: Joi.object({
        email: Joi.boolean(),
        sms: Joi.boolean(),
      }),
    }).optional(),
  }),
};

export default {
  updateUser,
};

export const changePassword = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required(),
  }),
};
