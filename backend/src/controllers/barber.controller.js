import BarberService from "../services/barber/barber.service.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import asyncHandler from "../utils/asyncHandler.js";

export const createBarberProfile = asyncHandler(async (req, res) => {
  const barber = await BarberService.createProfile(req.body);

  res.status(201).json(new ApiResponse(201, barber, "Barber profile created successfully"));
});

export const getAllBarbers = asyncHandler(async (req, res) => {
  const barbers = await BarberService.getAll(req.query);

  res.json(new ApiResponse(200, barbers, "Barbers fetched successfully"));
});

export const getBarberById = asyncHandler(async (req, res) => {
  const barber = await BarberService.getById(req.params.id);

  res.json(new ApiResponse(200, barber, "Barber fetched successfully"));
});

export const getMyBarberProfile = asyncHandler(async (req, res) => {
  const barber = await BarberService.getByUserId(req.user.id);

  res.json(new ApiResponse(200, barber, "Barber profile fetched successfully"));
});

export const updateBarberProfile = asyncHandler(async (req, res) => {
  const barber = await BarberService.update(req.params.id, req.body);

  res.json(new ApiResponse(200, barber, "Barber profile updated"));
});

export const deleteBarberProfile = asyncHandler(async (req, res) => {
  await BarberService.remove(req.params.id);

  res.json(new ApiResponse(200, null, "Barber profile deactivated"));
});

export const getBarberAvailability = asyncHandler(async (req, res) => {
  const slots = await BarberService.getAvailability(req.params.id, req.query);

  res.json(new ApiResponse(200, slots, "Availability fetched"));
});
