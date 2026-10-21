import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

import { getAdminDashboard, getAdminSlotAnalytics } from "../controllers/dashboard.controller.js";

const router = express.Router();

// Admin Dashboard
router.get("/admin", authenticate, authorize(["admin"]), getAdminDashboard);

// Admin Slot Analytics
router.get("/admin/slot-analytics", authenticate, authorize(["admin"]), getAdminSlotAnalytics);

export default router;
