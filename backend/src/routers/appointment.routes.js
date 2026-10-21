import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { idempotencyMiddleware } from "../middlewares/idempotency.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  updateStatus,
  addExtraService,
  getAvailableSlots,
  getMyAppointments,
  searchAppointments,
  getAppointmentById,
  getBarberAppointments,
  getBranchAppointments,
  getBranchMonthlyAppointments,
  getActiveBranchAppointments,
} from "../controllers/appointment.controller.js";

import {
  bookAppointment as bookValidation,
  reschedule as rescheduleValidation,
  updateStatus as statusValidation,
  addExtraService as addServiceValidation,
} from "../validators/appointment.validator.js";

const router = express.Router();

// Public slot availability (authenticated)
router.get("/slots", authenticate, getAvailableSlots); 

// Customer routes
router.get("/me", authenticate, getMyAppointments);
router.get("/search", authenticate, searchAppointments);
router.get("/:id", authenticate, getAppointmentById); // done

// Booking
router.post(
  "/book-oppt",
  authenticate,
  idempotencyMiddleware,
  validate(bookValidation),
  bookAppointment,
);

// Updates
router.put("/:id/reschedule", authenticate, validate(rescheduleValidation), rescheduleAppointment); // done
router.delete("/:id", authenticate, cancelAppointment); //done
router.patch(
  "/:id/status",
  authenticate,
  authorize(["barber", "admin"]),
  validate(statusValidation),
  updateStatus,
); // done
router.post("/:id/add-service", authenticate, validate(addServiceValidation), addExtraService);

// Barber-specific
router.get("/barber/:barberId", authenticate, getBarberAppointments);

// Branch-specific (admin only)
router.get(
  "/branch/:branchId/month",
  authenticate,
  authorize(["admin"]),
  getBranchMonthlyAppointments,
); //done

router.get(
  "/branch/:branchId/active",
  authenticate,
  authorize(["admin"]),
  getActiveBranchAppointments,
); //done

router.get("/branch/:branchId", authenticate, authorize(["admin"]), getBranchAppointments); //done

export default router;
