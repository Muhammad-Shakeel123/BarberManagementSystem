import DashboardService from "../services/dashboard/dashboard.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const stats = await DashboardService.getAdminDashboard();
  res.json(new ApiResponse(200, stats, "Dashboard stats fetched"));
});

export const getAdminSlotAnalytics = asyncHandler(async (req, res) => {
  const analytics = await DashboardService.getAdminSlotAnalytics({
    date: req.query.date,
    branchId: req.query.branchId,
  });
  res.json(new ApiResponse(200, analytics, "Slot analytics fetched successfully"));
});
