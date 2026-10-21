import Redis from "ioredis";
import logger from "./logger.js";

let redisClient = null;
let isConnected = false;

export const connectRedis = async () => {
  if (redisClient && isConnected) {
    logger.info("Using existing Redis connection");
    return redisClient;
  }

  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        logger.warn(`Redis retry attempt ${times}, waiting ${delay}ms`);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    });

    redisClient.on("connect", () => {
      logger.info("Redis connecting...");
    });

    redisClient.on("ready", () => {
      isConnected = true;
      logger.info("Redis connected and ready");
    });

    redisClient.on("error", (err) => {
      logger.error("Redis error:", err);
      isConnected = false;
    });

    redisClient.on("close", () => {
      logger.warn("Redis connection closed");
      isConnected = false;
    });

    redisClient.on("reconnecting", () => {
      logger.info("Redis reconnecting...");
    });

    await redisClient.ping();
    isConnected = true;
    logger.info("Redis ping successful");

    return redisClient;
  } catch (err) {
    logger.error("Redis connection failed:", err);
    return null;
  }
};

export const getRedisClient = () => redisClient;

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    isConnected = false;
    logger.info("Redis connection closed");
  }
};

export const isRedisConnected = () => isConnected;
