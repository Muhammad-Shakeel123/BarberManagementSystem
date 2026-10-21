import AuthService from "../services/auth/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body);
  res.status(201).json(new ApiResponse(201, result, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body);
  res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
