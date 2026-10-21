import AuditLogService from "../services/auditLog.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAuditLogs = asyncHandler(async (req, res) => {
  const result = await AuditLogService.list(req.query);

  res.json(new ApiResponse(200, result, "Audit logs fetched successfully"));
});

export const getAuditLogFilters = asyncHandler(async (req, res) => {
  const result = await AuditLogService.getFilters();

  res.json(new ApiResponse(200, result, "Audit log filters fetched successfully"));
});
