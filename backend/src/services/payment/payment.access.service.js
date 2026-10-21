import { ApiError } from "../../utils/ApiError.js";

class PaymentAccessService {
  static assertCanView(payment, user) {
    if (user.role !== "admin" && payment.customerId._id.toString() !== user.id) {
      throw new ApiError(403, "Not authorized to view this payment");
    }
  }

  static assertCanRefund(user) {
    if (user.role !== "admin") {
      throw new ApiError(403, "Only admins can process refunds");
    }
  }
}

export default PaymentAccessService;
