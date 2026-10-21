import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchCapacity,
  getNearbyBranches,
} from "../controllers/branch.controller.js";

import {
  createBranch as createValidation,
  updateBranch as updateValidation,
} from "../validators/branch.validator.js";

const router = express.Router();

// Public (authenticated)
router.get("/get-all-branches", authenticate, getAllBranches); //done
router.get("/nearby", authenticate, getNearbyBranches);
router.get("/:id", authenticate, getBranchById); //done
router.get("/:id/capacity", authenticate, getBranchCapacity); //done

// Admin only//done
router.post(
  "/create-branch",
  authenticate,
  authorize(["admin"]),
  validate(createValidation),
  createBranch,
);
router.put("/:id", authenticate, authorize(["admin"]), validate(updateValidation), updateBranch);
router.delete("/:id", authenticate, authorize(["admin"]), deleteBranch);

export default router;
