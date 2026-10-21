import mongoose from 'mongoose';
import logger from './logger.js';

let connection = null;

export const connectDB = async () => {
  if (connection) {
    logger.info('Using existing database connection');
    return connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    connection = conn;
    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    return conn;
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export const closeDB = async () => {
  if (connection) {
    await mongoose.connection.close();
    connection = null;
    logger.info('MongoDB connection closed');
  }
};

export const getConnection = () => connection;