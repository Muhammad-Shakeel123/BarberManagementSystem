import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

let io = null;

/**
 * Setup Socket.IO server
 */
export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (User: ${socket.userId})`);

    // Join user's personal room
    socket.join(`user_${socket.userId}`);

    // Join role-based room
    if (socket.userRole) {
      socket.join(`role_${socket.userRole}`);
    }

    // Join branch room
    socket.on('joinBranch', (branchId) => {
      socket.join(`branch_${branchId}`);
      logger.debug(`Socket ${socket.id} joined branch ${branchId}`);
    });

    socket.on('leaveBranch', (branchId) => {
      socket.leave(`branch_${branchId}`);
      logger.debug(`Socket ${socket.id} left branch ${branchId}`);
    });

    // Join barber room
    socket.on('joinBarber', (barberId) => {
      socket.join(`barber_${barberId}`);
      logger.debug(`Socket ${socket.id} joined barber ${barberId}`);
    });

    socket.on('leaveBarber', (barberId) => {
      socket.leave(`barber_${barberId}`);
      logger.debug(`Socket ${socket.id} left barber ${barberId}`);
    });

    // Queue updates
    socket.on('joinQueue', (branchId) => {
      socket.join(`queue_${branchId}`);
    });

    socket.on('leaveQueue', (branchId) => {
      socket.leave(`queue_${branchId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (err) => {
      logger.error(`Socket error: ${err.message}`);
    });
  });

  return io;
};

/**
 * Emit an event to a room
 */
export const emitEvent = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
    logger.debug(`Emitted ${event} to ${room}`);
  }
};

/**
 * Emit to a specific user
 */
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Emit to all connected clients
 */
export const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Get connected clients count
 */
export const getClientCount = () => {
  if (io) {
    return io.engine.clientsCount;
  }
  return 0;
};

/**
 * Get IO instance
 */
export const getIO = () => io;

export default {
  setupSocket,
  emitEvent,
  emitToUser,
  emitToAll,
  getClientCount,
  getIO,
};