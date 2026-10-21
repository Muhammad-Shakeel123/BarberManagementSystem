import UserService from "../services/user/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadImage } from "../config/cloudinary.js";

 
export const updateMe = asyncHandler(async (req, res) => {
  const user = await UserService.updateMe(req.user, req.body);
  res.json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const changeMyPassword = asyncHandler(async (req, res) => {
  const user = await UserService.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword,
  );
  res.json(new ApiResponse(200, user, "Password updated successfully"));
});

export const uploadMyAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, "Image file is required"));
  }

  const result = await uploadImage(req.file.buffer, "barberpro/avatars");
  const user = await UserService.updateAvatar(req.user.id, result.secure_url);

  res.json(new ApiResponse(200, user, "Profile image updated successfully"));
});

export const removeMyAvatar = asyncHandler(async (req, res) => {
  const user = await UserService.removeAvatar(req.user.id);

  res.json(new ApiResponse(200, user, "Profile image removed successfully"));
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await UserService.createCustomer(req.body);
  res.status(201).json(new ApiResponse(201, customer, "Customer created successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getAll(req.query);
  res.json(new ApiResponse(200, users, "Users fetched successfully"));
});


export const updateUser = asyncHandler(async (req, res) => {
  const user = await UserService.update(req.params.id, req.body);
  res.json(new ApiResponse(200, user, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await UserService.remove(req.params.id);
  res.json(new ApiResponse(200, null, "User deactivated successfully"));
});
