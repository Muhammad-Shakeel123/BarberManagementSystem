import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { getAuditLogFilters, getAuditLogs } from "../controllers/auditLog.controller.js";

const router = express.Router();

router.use(authenticate, authorize(["admin"]));
router.get("/filters", getAuditLogFilters);
router.get("/", getAuditLogs);

export default router;
