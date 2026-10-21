import Payment from "../../models/payment.model.js";
import { ApiError } from "../../utils/ApiError.js";

class PaymentQueryService {
  static async getPaymentDetails(paymentId) {
    const payment = await Payment.findById(paymentId)
      .populate("appointmentId", "startTime endTime status")
      .populate("customerId", "name email phone");
    if (!payment) throw new ApiError(404, "Payment not found");
    return payment;
  }

  static async getCustomerPayments(customerId) {
    return Payment.find({ customerId })
      .populate("appointmentId", "startTime endTime status serviceIds")
      .sort({ createdAt: -1 });
  }

  static async getAppointmentPayments(appointmentId) {
    return Payment.find({ appointmentId });
  }

  static async getAllPayments() {
  return Payment.find()
    .populate("appointmentId", "startTime endTime status serviceIds")
    .populate("customerId", "name email phone")
    .sort({ createdAt: -1 });
}
}

export default PaymentQueryService;
