import { noShowQueue, reminderQueue, notificationQueue, paymentQueue } from "../config/bull.js";

import AppointmentService from "../services/appointment.service.js";
import NotificationService from "../services/notification.service.js";
import PaymentService from "../services/payment.service.js";

import { NO_SHOW_GRACE_MINUTES, APPOINTMENT_STATUS } from "../constant.js";

import logger from "../config/logger.js";
import moment from "moment";

import Appointment from "../models/appointment.model.js";
import Payment from "../models/payment.model.js";

/**
 * Initialize all background queues
 */
export const initQueues = async () => {
  // =========================================================
  // NO-SHOW QUEUE
  // =========================================================

  noShowQueue.process(async (job) => {
    logger.info("Running no-show check...");

    const threshold = moment().subtract(NO_SHOW_GRACE_MINUTES, "minutes").toDate();

    const appointments = await Appointment.find({
      status: {
        $in: [APPOINTMENT_STATUS.BOOKED, APPOINTMENT_STATUS.CONFIRMED],
      },
      startTime: {
        $lt: threshold,
      },
    }).select("_id startTime branchId");

    let processed = 0;

    for (const appointment of appointments) {
      const result = await AppointmentService.markNoShow(appointment._id);

      if (result) {
        processed++;

        logger.info(`Marked no-show: ${appointment._id}`);
      }
    }

    return {
      found: appointments.length,
      processed,
    };
  });

  // Run no-show check every minute
  noShowQueue.add(
    {},
    {
      repeat: {
        cron: "* * * * *",
      },
    },
  );

  // =========================================================
  // REMINDER QUEUE
  // =========================================================

  reminderQueue.process(async (job) => {
    logger.info("Running reminder check...");

    const now = moment();

    const targetTime = now.clone().add(24, "hours");

    const appointments = await Appointment.find({
      status: {
        $in: [APPOINTMENT_STATUS.BOOKED, APPOINTMENT_STATUS.CONFIRMED],
      },

      startTime: {
        $gte: now.clone().add(23, "hours").toDate(),
        $lte: targetTime.clone().add(1, "hour").toDate(),
      },
    }).populate("customerId");

    let remindersSent = 0;

    for (const appointment of appointments) {
      if (appointment.customerId && appointment.customerId.email) {
        await NotificationService.sendAppointmentReminder(appointment, appointment.customerId);

        remindersSent++;

        logger.info(`Reminder sent for appointment ${appointment._id}`);
      }
    }

    return {
      found: appointments.length,
      remindersSent,
    };
  });

  // Run reminder check every 2 hours
  reminderQueue.add(
    {},
    {
      repeat: {
        cron: "0 */2 * * *",
      },
    },
  );

  // =========================================================
  // NOTIFICATION QUEUE
  // =========================================================

  notificationQueue.process(async (job) => {
    const { type, data } = job.data;

    logger.info(`Processing notification: ${type}`);

    try {
      switch (type) {
        case "email":
          await NotificationService.sendEmail(data.to, data.subject, data.html);
          break;

        case "sms":
          await NotificationService.sendSMS(data.phone, data.message);
          break;

        default:
          logger.warn(`Unknown notification type: ${type}`);
      }
    } catch (error) {
      logger.error(`Notification failed: ${error.message}`);

      // Throw error so Bull can retry the job
      throw error;
    }
  });

  // =========================================================
  // PAYMENT QUEUE
  // =========================================================

  paymentQueue.process(async (job) => {
    const { paymentId, action } = job.data;

    logger.info(`Processing payment job: ${action} for ${paymentId}`);

    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        logger.error(`Payment not found: ${paymentId}`);

        return;
      }

      switch (action) {
        case "confirm":
          await PaymentService.confirmPayment(paymentId, {});
          break;

        case "refund":
          await PaymentService.refundPayment(paymentId, payment.amount, "Auto-refund");
          break;

        default:
          logger.warn(`Unknown payment action: ${action}`);
      }
    } catch (error) {
      logger.error(`Payment job failed: ${error.message}`);

      // Throw error so Bull can retry the job
      throw error;
    }
  });

  logger.info("All queues initialized");
};

/**
 * Add a job to notification queue
 */
export const addNotificationJob = (type, data) => {
  return notificationQueue.add(
    {
      type,
      data,
    },
    {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );
};

/**
 * Add a job to payment queue
 */
export const addPaymentJob = (paymentId, action) => {
  return paymentQueue.add(
    {
      paymentId,
      action,
    },
    {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 3000,
      },
    },
  );
};
