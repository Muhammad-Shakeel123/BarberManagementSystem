import Joi from "joi";

export const addToQueue = {
  body: Joi.object({
    branchId: Joi.string().required(),

    customerId: Joi.string().optional(),

    requestedBarberId: Joi.string().optional(),

    serviceIds: Joi.array().items(Joi.string()).min(1).required(),
  }),
};

export const assignNext = {
  body: Joi.object({
    branchId: Joi.string().required(),
    barberId: Joi.string().required(),
  }),
};

export default {
  addToQueue,
  assignNext,
};
