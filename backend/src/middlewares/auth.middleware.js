import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import BarberProfile from "../models/barberProfile.model.js";

/**
 * Authenticate user via JWT
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token required");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (!user.isActive) {
      throw new ApiError(401, "User account is deactivated");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid token");
    }
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Token expired");
    }
    next(err);
  }
};

/**
 * Authorize user by role
 */
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Access denied. Required roles: ${roles.join(", ")}`);
    }

    next();
  };
};

/**
 * Check if user is a barber and has valid barber profile
 */
export const isBarber = async (req, res, next) => {
  if (req.user.role !== "barber") {
    throw new ApiError(403, "Barber role required");
  }

  const barber = await BarberProfile.findOne({ userId: req.user.id });

  if (!barber || !barber.isActive) {
    throw new ApiError(403, "Barber profile not found or inactive");
  }

  req.barber = barber;
  next();
};

/**
 * Check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin role required");
  }
  next();
};
