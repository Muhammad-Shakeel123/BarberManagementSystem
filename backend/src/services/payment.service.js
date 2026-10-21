import PaymentIntentService from "./payment/payment.intent.service.js";
import PaymentConfirmationService from "./payment/payment.confirmation.service.js";
import PaymentRefundService from "./payment/payment.refund.service.js";
import PaymentQueryService from "./payment/payment.query.service.js";

class PaymentService {
  static createPaymentIntent(...args) {
    return PaymentIntentService.createPaymentIntent(...args);
  }
  static confirmPayment(...args) {
    return PaymentConfirmationService.confirmPayment(...args);
  }
  static handleWebhook(...args) {
    return PaymentConfirmationService.handleWebhook(...args);
  }
  static refundPayment(...args) {
    return PaymentRefundService.refundPayment(...args);
  }
  static getPaymentDetails(...args) {
    return PaymentQueryService.getPaymentDetails(...args);
  }
  static getCustomerPayments(...args) {
    return PaymentQueryService.getCustomerPayments(...args);
  }

  static getAllPayments(...args) {
  return PaymentQueryService.getAllPayments(...args);
}
  static getAppointmentPayments(...args) {
    return PaymentQueryService.getAppointmentPayments(...args);
  }
}

export default PaymentService;
