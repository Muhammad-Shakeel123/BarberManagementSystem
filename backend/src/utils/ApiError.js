/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.name = this.constructor.name;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}