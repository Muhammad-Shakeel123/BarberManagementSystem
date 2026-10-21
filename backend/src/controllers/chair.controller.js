import ChairService from "../services/chair/chair.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createChair = asyncHandler(async (req, res) => {
  const chair = await ChairService.create(req.body);
  res.status(201).json(new ApiResponse(201, chair, "Chair created successfully"));
});

export const getChairsByBranch = asyncHandler(async (req, res) => {
  const chairs = await ChairService.getByBranch(req.params.branchId, req.query);
  res.json(new ApiResponse(200, chairs, "Chairs fetched successfully"));
});

export const getChairById = asyncHandler(async (req, res) => {
  const chair = await ChairService.getById(req.params.id);
  res.json(new ApiResponse(200, chair, "Chair fetched successfully"));
});

export const updateChair = asyncHandler(async (req, res) => {
  const chair = await ChairService.update(req.params.id, req.body);
  res.json(new ApiResponse(200, chair, "Chair updated successfully"));
});

export const deleteChair = asyncHandler(async (req, res) => {
  await ChairService.remove(req.params.id);
  res.json(new ApiResponse(200, null, "Chair deleted successfully"));
});

export const getChairAvailability = asyncHandler(async (req, res) => {
  const appointments = await ChairService.getAvailability(req.params.id, req.query.date);
  res.json(new ApiResponse(200, appointments, "Chair availability fetched"));
});
