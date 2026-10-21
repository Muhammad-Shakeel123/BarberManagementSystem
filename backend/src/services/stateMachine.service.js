import { ALLOWED_STATUS_TRANSITIONS, APPOINTMENT_STATUS } from "../constant.js";
import { ApiError } from "../utils/ApiError.js";
import AuditLog from "../models/auditLog.model.js";
import logger from "../config/logger.js";
import mongoose from "mongoose";

class StateMachine {
  static async transition(appointment, newStatus, userId, reason = "", options = {}) {
    const currentStatus = appointment.status;

    // Validate transition
    const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new ApiError(
        400,
        `Invalid status transition: ${currentStatus} -> ${newStatus}`,
        `Allowed transitions: ${allowed.join(", ")}`,
      );
    }

    // Additional business rules
    this._validateTransitionRules(appointment, newStatus, options);

    // Capture old state for audit
    const oldState = {
      status: appointment.status,
      actualStartTime: appointment.actualStartTime,
      actualEndTime: appointment.actualEndTime,
    };

    // Apply transition
    appointment.status = newStatus;

    // Special handling for specific statuses
    if (newStatus === APPOINTMENT_STATUS.IN_PROGRESS) {
      if (!appointment.actualStartTime) {
        appointment.actualStartTime = new Date();
      }
    }

    if (newStatus === APPOINTMENT_STATUS.COMPLETED) {
      if (!appointment.actualStartTime) {
        throw new ApiError(400, "Cannot complete appointment that has not started");
      }
      if (!appointment.actualEndTime) {
        appointment.actualEndTime = new Date();
      }
    }

    if (newStatus === APPOINTMENT_STATUS.CANCELLED) {
      if (currentStatus === APPOINTMENT_STATUS.IN_PROGRESS) {
        throw new ApiError(400, "Cannot cancel an in-progress appointment");
      }
    }

    // Save the appointment
    await appointment.save();

    // Create audit log
    try {
      await AuditLog.create({
        userId: mongoose.isValidObjectId(userId) ? userId : null,
        actorType: mongoose.isValidObjectId(userId) ? "user" : "system",
        action: `status_${newStatus}`,
        targetType: "Appointment",
        targetId: appointment._id,
        changes: {
          from: oldState,
          to: {
            status: appointment.status,
            actualStartTime: appointment.actualStartTime,
            actualEndTime: appointment.actualEndTime,
          },
          reason,
        },
        metadata: {
          actor: mongoose.isValidObjectId(userId) ? undefined : String(userId || "system"),
        },
      });
    } catch (err) {
      logger.error("Failed to create audit log:", err);
    }

    logger.info(
      `Appointment ${appointment._id} transitioned: ${currentStatus} -> ${newStatus} by ${userId}`,
    );

    return appointment;
  }

  static _validateTransitionRules(appointment, newStatus, options) {
    if (newStatus === APPOINTMENT_STATUS.IN_PROGRESS) {
      const now = new Date();

      if (now < appointment.startTime) {
        throw new ApiError(400, "Appointment cannot be started before its scheduled time");
      }
    }

    if (newStatus === APPOINTMENT_STATUS.COMPLETED && !options.forceComplete) {
      if (!appointment.actualStartTime) {
        throw new ApiError(400, "Cannot complete appointment without starting it first");
      }

      // Check if minimum service time has passed (optional)
      // We skip this for flexibility
    }

    if (
      newStatus === APPOINTMENT_STATUS.CONFIRMED &&
      appointment.status === APPOINTMENT_STATUS.BOOKED
    ) {
      // Check if payment is required but not paid
      // This is handled in the payment service
    }
  }

  /**
   * Check if a transition is allowed without performing it
   */
  static isTransitionAllowed(currentStatus, newStatus) {
    const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    return allowed.includes(newStatus);
  }

  /**
   * Get available next statuses for a given status
   */
  static getNextStatuses(currentStatus) {
    return ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Check if appointment is in a terminal state
   */
  static isTerminal(status) {
    return [
      APPOINTMENT_STATUS.COMPLETED,
      APPOINTMENT_STATUS.CANCELLED,
      APPOINTMENT_STATUS.NO_SHOW,
    ].includes(status);
  }

  /**
   * Check if appointment is editable
   */
  static isEditable(status) {
    return [
      APPOINTMENT_STATUS.BOOKED,
      APPOINTMENT_STATUS.CONFIRMED,
      APPOINTMENT_STATUS.IN_PROGRESS,
    ].includes(status);
  }
}

export default StateMachine;
