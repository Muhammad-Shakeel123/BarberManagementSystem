import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import logger from "./config/logger.js";
import auditLogRoutes from "./routers/auditLog.routes.js";
import { webhookHandler } from "./controllers/payment.controller.js";

// Import routes
import authRoutes from "./routers/auth.routes.js";
import userRoutes from "./routers/user.routes.js";
import barberRoutes from "./routers/barber.routes.js";
import branchRoutes from "./routers/branch.routes.js";
import chairRoutes from "./routers/chair.routes.js";
import serviceRoutes from "./routers/service.routes.js";
import appointmentRoutes from "./routers/appointment.routes.js";
import queueRoutes from "./routers/queue.routes.js";
import paymentRoutes from "./routers/payment.routes.js";
import dashboardRoutes from "./routers/dashboard.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);
// Stripe webhook must receive the raw request body
app.post("/api/v1/payments/webhook", express.raw({ type: "application/json" }), webhookHandler);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/barbers", barberRoutes);
app.use("/api/v1/branches", branchRoutes);
app.use("/api/v1/chairs", chairRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/queue", queueRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/audit-logs", auditLogRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorMiddleware);

export default app;
