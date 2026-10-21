import Payment from "../../models/payment.model.js";
import Appointment from "../../models/appointment.model.js";
import { PAYMENT_STATUS } from "../../constant.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../config/logger.js";
import stripe from "../../config/stripe.js";

class PaymentIntentService {
  static async createPaymentIntent(appointmentId, paymentMethod = "card") {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new ApiError(404, "Appointment not found");

    const payment = await Payment.findOne({ appointmentId });
    if (!payment) throw new ApiError(404, "Payment record not found");
    if (payment.status === PAYMENT_STATUS.PAID) throw new ApiError(400, "Payment already completed");
    if (!payment.amount || payment.amount <= 0) throw new ApiError(400, "Invalid payment amount");

    const amountInCents = Math.round(payment.amount * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        appointmentId: appointment._id.toString(),
        paymentId: payment._id.toString(),
        customerId: payment.customerId.toString(),
      },
      description: `Barber appointment ${appointment._id}`,
    });

    payment.transactionId = paymentIntent.id;
    payment.paymentMethod = paymentMethod;
    await payment.save();

    logger.info(`Stripe PaymentIntent created: ${paymentIntent.id} for appointment ${appointmentId}`);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      paymentIntentId: paymentIntent.id,
      amount: payment.amount,
      currency: "usd",
    };
  }
}

export default PaymentIntentService;
