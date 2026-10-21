import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBarberProfile,
  getAllBarbers,
  getBarberById,
  getMyBarberProfile,
  updateBarberProfile,
  deleteBarberProfile,
  getBarberAvailability,
} from "../controllers/barber.controller.js";

import {
  createBarber as createValidation,
  updateBarber as updateValidation,
} from "../validators/barber.validator.js";

const router = express.Router();
router.get("/", authenticate, authorize(["admin", "customer"]), getAllBarbers); //done
router.get("/me", authenticate, authorize(["barber"]), getMyBarberProfile);

router.get("/:id", authenticate, getBarberById);
router.get("/:id/availability", authenticate, getBarberAvailability); // done for admin and important for customer

router.post(
  "/create-barber-profile",
  authenticate,
  authorize(["admin"]),
  validate(createValidation),
  createBarberProfile,
); //done
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validate(updateValidation),
  updateBarberProfile,
); // done
router.delete("/:id", authenticate, authorize(["admin"]), deleteBarberProfile); //done

export default router;
