import Payment from "../../models/payment.model.js";
import Appointment from "../../models/appointment.model.js";
import StateMachine from "../stateMachine.service.js";
import { PAYMENT_STATUS, APPOINTMENT_STATUS, SOCKET_EVENTS } from "../../constant.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../config/logger.js";
import { emitToUser } from "../../websockets/socket.js";

class PaymentConfirmationService {
  static async confirmPayment(paymentId, transactionData) {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new ApiError(404, "Payment not found");
    if (payment.status === PAYMENT_STATUS.PAID) return payment;

    payment.status = PAYMENT_STATUS.PAID;
    payment.paidAt = new Date();
    payment.webhookData = transactionData || {};
    await payment.save();

    const appointment = await Appointment.findById(payment.appointmentId);
    if (appointment) {
      const paidAmount = payment.depositAmount > 0 ? payment.depositAmount : payment.amount;
      appointment.depositPaid = paidAmount;

      if (appointment.status === APPOINTMENT_STATUS.BOOKED) {
        await StateMachine.transition(
          appointment,
          APPOINTMENT_STATUS.CONFIRMED,
          "system",
          "Payment confirmed",
        );
      } else {
        await appointment.save();
      }

      emitToUser(payment.customerId, SOCKET_EVENTS.APPOINTMENT_UPDATED, {
        appointmentId: appointment._id,
        status: appointment.status,
        paymentStatus: payment.status,
      });
    }

    logger.info(`Payment ${paymentId} confirmed`);
    return payment;
  }

  static async handleWebhook(event) {
    logger.info(`Stripe webhook received: ${event.type}`);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const payment = await Payment.findOne({ transactionId: paymentIntent.id });
        if (!payment) {
          logger.warn(`Payment not found for Stripe PaymentIntent: ${paymentIntent.id}`);
          return null;
        }
        return this.confirmPayment(payment._id, paymentIntent);
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const payment = await Payment.findOne({ transactionId: paymentIntent.id });
        if (!payment) {
          logger.warn(`Payment not found for failed Stripe PaymentIntent: ${paymentIntent.id}`);
          return null;
        }

        payment.status = PAYMENT_STATUS.FAILED;
        payment.webhookData = paymentIntent;
        await payment.save();
        logger.warn(`Payment failed: ${payment._id}`);
        return payment;
      }

      default:
        logger.info(`Unhandled Stripe webhook event: ${event.type}`);
        return null;
    }
  }
}

export default PaymentConfirmationService;
