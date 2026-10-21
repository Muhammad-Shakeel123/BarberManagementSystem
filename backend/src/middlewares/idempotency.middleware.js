import { getRedisClient, isRedisConnected } from '../config/redis.js';
import logger from '../config/logger.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory fallback cache
const memoryCache = new Map();

/**
 * Idempotency middleware to prevent duplicate requests
 */
export const idempotencyMiddleware = async (req, res, next) => {
  const key = req.headers['idempotency-key'];

  // Skip if no idempotency key
  if (!key) {
    return next();
  }

  // Check cache
  let cachedResponse = null;

  try {
    const client = getRedisClient();
    if (client && isRedisConnected()) {
      const cached = await client.get(`idemp:${key}`);
      if (cached) {
        cachedResponse = JSON.parse(cached);
      }
    } else {
      // Fallback to memory cache
      if (memoryCache.has(key)) {
        cachedResponse = memoryCache.get(key);
      }
    }
  } catch (err) {
    logger.error(`Idempotency cache error: ${err.message}`);
  }

  // If cached response exists, return it
  if (cachedResponse) {
    logger.info(`Idempotent request: returning cached response for key ${key}`);
    return res.status(cachedResponse.statusCode || 200).json(cachedResponse);
  }

  // Store original send method
  const originalSend = res.json;
  const originalStatus = res.status;

  res.json = function (body) {
    // Only cache successful responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const responseToCache = {
        statusCode: res.statusCode,
        ...body,
      };

      try {
        const client = getRedisClient();
        if (client && isRedisConnected()) {
          client.setex(`idemp:${key}`, 3600, JSON.stringify(responseToCache));
        } else {
          // Fallback to memory cache (with expiry)
          memoryCache.set(key, responseToCache);
          setTimeout(() => memoryCache.delete(key), 3600000);
        }
      } catch (err) {
        logger.error(`Idempotency cache set error: ${err.message}`);
      }
    }

    return originalSend.call(this, body);
  };

  next();
};

/**
 * Generate idempotency key if not provided
 */
export const generateIdempotencyKey = (req, res, next) => {
  if (!req.headers['idempotency-key']) {
    req.headers['idempotency-key'] = uuidv4();
  }
  next();
};