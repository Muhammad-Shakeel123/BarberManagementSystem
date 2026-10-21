import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createPaymentIntent,
  getPaymentDetails,
  getMyPayments,
  getAllPayments,
  refundPayment,
} from "../controllers/payment.controller.js";

import {
  createPaymentIntent as intentValidation,
  refundPayment as refundValidation,
} from "../validators/payment.validator.js";

const router = express.Router();

// Customer routes
router.post("/create-intent", authenticate, validate(intentValidation), createPaymentIntent);
router.get("/me", authenticate, getMyPayments);
// Admin routes
router.get("/admin/all", authenticate, authorize(["admin"]), getAllPayments);
router.get("/:id", authenticate, getPaymentDetails);

// Admin refund
router.post(
  "/:id/refund",
  authenticate,
  authorize(["admin"]),
  validate(refundValidation),
  refundPayment,
);

export default router;
