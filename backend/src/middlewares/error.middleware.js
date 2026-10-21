import { ApiError } from "../utils/ApiError.js";
import logger from "../config/logger.js";

/**
 * Global error handler middleware
 */
export const errorMiddleware = (err, req, res, next) => {
  // Log error
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );
  if (err.stack) {
    logger.debug(err.stack);
  }

  // Handle known ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const duplicateField =
      err.keyPattern && Object.keys(err.keyPattern).length > 0
        ? Object.keys(err.keyPattern)[0]
        : err.keyValue && Object.keys(err.keyValue).length > 0
          ? Object.keys(err.keyValue)[0]
          : "unknown";

    return res.status(400).json({
      success: false,
      message:
        duplicateField === "unknown"
          ? "Duplicate value already exists"
          : `Duplicate value for field: ${duplicateField}`,
      errors:
        duplicateField === "unknown"
          ? []
          : [
              {
                field: duplicateField,
                message: `${duplicateField} already exists`,
              },
            ],
    });
  }

  // Handle Mongoose Cast errors
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Default error
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
