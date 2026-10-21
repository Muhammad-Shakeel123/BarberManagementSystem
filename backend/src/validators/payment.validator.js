import Joi from 'joi';

export const createPaymentIntent = {
  body: Joi.object({
    appointmentId: Joi.string().required(),
    paymentMethod: Joi.string().valid('cash', 'card', 'stripe', 'paypal', 'other').default('card'),
  }),
};

export const refundPayment = {
  body: Joi.object({
    amount: Joi.number().min(0).optional(),
    reason: Joi.string().max(200).optional(),
  }),
};

export default {
  createPaymentIntent,
  refundPayment,
};