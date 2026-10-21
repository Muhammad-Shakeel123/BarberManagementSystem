import Queue from "bull";
import logger from "./logger.js";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

// Create queues
export const notificationQueue = new Queue("notification", { redis: redisConfig });
export const noShowQueue = new Queue("no-show", { redis: redisConfig });
export const paymentQueue = new Queue("payment", { redis: redisConfig });
export const reminderQueue = new Queue("reminder", { redis: redisConfig });

// Queue event handlers
const setupQueueEvents = (queue, name) => {
  queue.on("completed", (job) => {
    logger.debug(`Queue ${name}: Job ${job.id} completed`);
  });

  queue.on("failed", (job, err) => {
    logger.error(`Queue ${name}: Job ${job.id} failed - ${err.message}`);
  });

  queue.on("error", (err) => {
    logger.error(`Queue ${name}: Error - ${err.message}`);
  });

  queue.on("stalled", (job) => {
    logger.warn(`Queue ${name}: Job ${job.id} stalled`);
  });
};

setupQueueEvents(notificationQueue, "notification");
setupQueueEvents(noShowQueue, "no-show");
setupQueueEvents(paymentQueue, "payment");
setupQueueEvents(reminderQueue, "reminder");

export { redisConfig };
