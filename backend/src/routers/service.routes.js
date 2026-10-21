import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServiceCategories,
} from "../controllers/service.controller.js";

import {
  createService as createValidation,
  updateService as updateValidation,
} from "../validators/service.validator.js";

const router = express.Router();

router.get("/get-all-services", authenticate, getAllServices);//done
router.get("/categories", authenticate, getServiceCategories);//codne
router.get("/:id", authenticate, getServiceById);//done

router.post(
  "/create-services",
  authenticate,
  authorize(["admin"]),
  validate(createValidation),
  createService,
);
router.put("/:id", authenticate, authorize(["admin"]), validate(updateValidation), updateService);
router.delete("/:id", authenticate, authorize(["admin"]), deleteService);

export default router;
