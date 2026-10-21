import api from "./api";

// Create Stripe PaymentIntent
export const createPaymentIntent = async (
  appointmentId,
  paymentMethod = "card",
) => {
  const response = await api.post("/payments/create-intent", {
    appointmentId,
    paymentMethod,
  });

  return response.data;
};

//Get current customer's payments
export const getMyPayments = async () => {
  const response = await api.get("/payments/me");

  return response.data;
};

// Get payment details
export const getPaymentById = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);

  return response.data;
};

// Admin refund payment
export const refundPayment = async (paymentId, data = {}) => {
  const response = await api.post(`/payments/${paymentId}/refund`, data);

  return response.data;
};
export const getAllPayments = async () => {
  const response = await api.get("/payments/admin/all");

  return response.data;
};
