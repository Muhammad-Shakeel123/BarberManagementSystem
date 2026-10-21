import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { initQueues } from './queues/index.js';
import { setupSocket } from './websockets/socket.js';
import logger from './config/logger.js';

dotenv.config();

const PORT = process.env.PORT || 8000;

let server;

(async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('MongoDB connected');

    // Connect to Redis
    await connectRedis();
    logger.info('Redis connected');

    // Initialize Bull queues
    await initQueues();
    logger.info('Queues initialized');

    // Start Express server
    server = app.listen(PORT, () => {
      logger.info(` Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });

    // Setup Socket.io
    setupSocket(server);
    logger.info('WebSocket server ready');

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      if (server) {
        server.close(() => {
          logger.info('HTTP server closed');
        });
      }
      // Close database connections
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (err) {
    logger.error('Startup error:', err);
    process.exit(1);
  }
})();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});

export { server };