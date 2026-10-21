import PaymentService from "../services/payment.service.js";
import PaymentWebhookService from "../services/payment/payment.webhook.service.js";
import PaymentAccessService from "../services/payment/payment.access.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { appointmentId, paymentMethod } = req.body;
  const result = await PaymentService.createPaymentIntent(
    appointmentId, paymentMethod, req.user.id,
  );
  res.json(new ApiResponse(200, result, "Payment intent created"));
});

export const webhookHandler = asyncHandler(async (req, res) => {
  const result = await PaymentWebhookService.process(
    req.body, req.headers["stripe-signature"],
  );
  res.json(new ApiResponse(200, result, "Webhook processed successfully"));
});

export const getPaymentDetails = asyncHandler(async (req, res) => {
  const payment = await PaymentService.getPaymentDetails(req.params.id);
  PaymentAccessService.assertCanView(payment, req.user);
  res.json(new ApiResponse(200, payment, "Payment details fetched"));
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await PaymentService.getCustomerPayments(req.user.id);
  res.json(new ApiResponse(200, payments, "Payments fetched successfully"));
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await PaymentService.getAllPayments();

  res.json(
    new ApiResponse(
      200,
      payments,
      "All payments fetched successfully",
    ),
  );
});

export const refundPayment = asyncHandler(async (req, res) => {
  PaymentAccessService.assertCanRefund(req.user);
  const payment = await PaymentService.refundPayment(
    req.params.id, req.body.amount, req.body.reason,
  );
  res.json(new ApiResponse(200, payment, "Refund processed successfully"));
});
