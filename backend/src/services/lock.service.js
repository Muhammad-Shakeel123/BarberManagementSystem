import { getRedisClient, isRedisConnected } from "../config/redis.js";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger.js";

class LockService {
  static async acquire(key, ttl = 5000) {
    try {
      const client = getRedisClient();
      if (!client || !isRedisConnected()) {
        logger.warn("Redis not available, using fallback lock");
        return this._fallbackAcquire(key);
      }

      const token = uuidv4();
      const result = await client.set(key, token, "PX", ttl, "NX");

      if (result === "OK") {
        logger.debug(`Lock acquired: ${key} (${token})`);
        return token;
      }

      logger.debug(`Lock acquisition failed: ${key}`);
      return null;
    } catch (err) {
      logger.error(`Lock acquire error: ${err.message}`);
      return this._fallbackAcquire(key);
    }
  }

  static async release(key, token) {
    try {
      const client = getRedisClient();
      if (!client || !isRedisConnected()) {
        logger.warn("Redis not available, using fallback release");
        return this._fallbackRelease(key, token);
      }

      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;

      const result = await client.eval(script, 1, key, token);

      if (result === 1) {
        logger.debug(`Lock released: ${key}`);
        return true;
      }

      logger.debug(`Lock release failed (token mismatch): ${key}`);
      return false;
    } catch (err) {
      logger.error(`Lock release error: ${err.message}`);
      return this._fallbackRelease(key, token);
    }
  }

  /**
   * Fallback in-memory lock when Redis is unavailable
   */
  static _fallbackLocks = new Map();

  static _fallbackAcquire(key) {
    const now = Date.now();
    const existing = this._fallbackLocks.get(key);

    if (existing && existing.expiry > now) {
      return null;
    }

    const token = uuidv4();
    this._fallbackLocks.set(key, {
      token,
      expiry: now + 5000,
    });

    // Clean up expired locks periodically
    if (Math.random() < 0.01) {
      this._cleanupFallbackLocks();
    }

    return token;
  }

  static _fallbackRelease(key, token) {
    const lock = this._fallbackLocks.get(key);
    if (lock && lock.token === token) {
      this._fallbackLocks.delete(key);
      return true;
    }
    return false;
  }

  static _cleanupFallbackLocks() {
    const now = Date.now();
    for (const [key, value] of this._fallbackLocks) {
      if (value.expiry < now) {
        this._fallbackLocks.delete(key);
      }
    }
  }

  static async withLock(key, fn, ttl = 5000) {
    const token = await this.acquire(key, ttl);
    if (!token) {
      throw new Error("Could not acquire lock. Please try again.");
    }

    try {
      return await fn();
    } finally {
      await this.release(key, token);
    }
  }
}

export default LockService;
