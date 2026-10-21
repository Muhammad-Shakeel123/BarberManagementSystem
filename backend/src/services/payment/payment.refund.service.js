import Payment from "../../models/payment.model.js";
import { PAYMENT_STATUS } from "../../constant.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../config/logger.js";

class PaymentRefundService {
  static async refundPayment(paymentId, amount, reason) {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new ApiError(404, "Payment not found");
    if (payment.status !== PAYMENT_STATUS.PAID) {
      throw new ApiError(400, "Payment is not in a refundable state");
    }
    if (payment.refundId) throw new ApiError(400, "Payment already refunded");

    const refundAmount = amount || payment.amount;
    const mockRefundId = `re_mock_${Date.now()}`;

    payment.status = PAYMENT_STATUS.REFUNDED;
    payment.refundId = mockRefundId;
    payment.refundAmount = refundAmount;
    payment.refundReason = reason || "Customer request";
    payment.refundedAt = new Date();
    await payment.save();

    logger.info(`Payment ${paymentId} refunded for ${refundAmount}`);
    return payment;
  }
}

export default PaymentRefundService;
