import ServiceCatalogService from "../services/catalog/service.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createService = asyncHandler(async (req, res) => {
  const service = await ServiceCatalogService.create(req.body);
  res.status(201).json(new ApiResponse(201, service, "Service created successfully"));
});

export const getAllServices = asyncHandler(async (req, res) => {
  const services = await ServiceCatalogService.getAll(req.query);
  res.json(new ApiResponse(200, services, "Services fetched successfully"));
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await ServiceCatalogService.getById(req.params.id);
  res.json(new ApiResponse(200, service, "Service fetched successfully"));
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await ServiceCatalogService.update(req.params.id, req.body);
  res.json(new ApiResponse(200, service, "Service updated successfully"));
});

export const deleteService = asyncHandler(async (req, res) => {
  await ServiceCatalogService.remove(req.params.id);
  res.json(new ApiResponse(200, null, "Service deactivated successfully"));
});

export const getServiceCategories = asyncHandler(async (req, res) => {
  const categories = await ServiceCatalogService.getCategories();
  res.json(new ApiResponse(200, categories, "Categories fetched successfully"));
});
