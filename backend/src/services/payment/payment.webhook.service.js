import Stripe from "stripe";
import PaymentService from "../payment.service.js";
import { ApiError } from "../../utils/ApiError.js";

class PaymentWebhookService {
  static stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  static async process(rawBody, signature) {
    if (!signature) throw new ApiError(400, "Missing Stripe signature");

    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      throw new ApiError(400, `Webhook signature verification failed: ${error.message}`);
    }

    return PaymentService.handleWebhook(event);
  }
}

export default PaymentWebhookService;
