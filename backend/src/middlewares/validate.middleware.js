import { ApiError } from '../utils/ApiError.js';

/**
 * Validation middleware using Joi
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const parts = ['body', 'query', 'params', 'headers'];
    const errors = [];

    for (const part of parts) {
      if (schema[part]) {
        const { error } = schema[part].validate(req[part], {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          const details = error.details.map(d => ({
            field: d.path.join('.'),
            message: d.message,
          }));
          errors.push(...details);
        }
      }
    }

    if (errors.length > 0) {
      return next(new ApiError(400, 'Validation failed', errors));
    }

    next();
  };
};

/**
 * Validate request body only
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return next(new ApiError(400, 'Validation failed', errors));
    }

    next();
  };
};

/**
 * Validate request params
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return next(new ApiError(400, 'Invalid parameters', errors));
    }

    next();
  };
};

/**
 * Validate request query
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return next(new ApiError(400, 'Invalid query parameters', errors));
    }

    next();
  };
};