import Joi from "joi";

export const register = {
  body: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .optional(),
    role: Joi.string().valid("customer", "barber", "admin").default("customer"),
  }),
};

export const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export default {
  register,
  login,
};
