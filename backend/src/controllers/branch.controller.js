import BranchService from "../services/branch/branch.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createBranch = asyncHandler(async (req, res) => {
  const branch = await BranchService.create(req.body);
  res.status(201).json(new ApiResponse(201, branch, "Branch created successfully"));
});

export const getAllBranches = asyncHandler(async (req, res) => {
  const branches = await BranchService.getAll(req.query);
  res.json(new ApiResponse(200, branches, "Branches fetched successfully"));
});

export const getBranchById = asyncHandler(async (req, res) => {
  const branch = await BranchService.getById(req.params.id);
  res.json(new ApiResponse(200, branch, "Branch fetched successfully"));
});

export const updateBranch = asyncHandler(async (req, res) => {
  const branch = await BranchService.update(req.params.id, req.body);
  res.json(new ApiResponse(200, branch, "Branch updated successfully"));
});

export const deleteBranch = asyncHandler(async (req, res) => {
  await BranchService.remove(req.params.id);
  res.json(new ApiResponse(200, null, "Branch deactivated successfully"));
});

export const getBranchCapacity = asyncHandler(async (req, res) => {
  const data = await BranchService.getCapacity(req.params.id, req.query.date);
  res.json(new ApiResponse(200, data, "Branch capacity fetched"));
});

export const getNearbyBranches = asyncHandler(async (req, res) => {
  const branches = await BranchService.getNearby({
    lat: req.query.lat,
    lng: req.query.lng,
    maxDistance: req.query.maxDistance,
  });

  res.json(new ApiResponse(200, branches, "Nearby branches fetched successfully"));
});
