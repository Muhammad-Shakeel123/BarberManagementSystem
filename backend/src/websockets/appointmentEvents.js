import BarberProfile from "../models/barberProfile.model.js";
import { emitToUser } from "./socket.js";
import logger from "../config/logger.js";

export const emitAppointmentToUsers = async (appointment, event, data = {}) => {
  try {
    const userIds = new Set();

    if (appointment?.customerId) {
      userIds.add(appointment.customerId.toString());
    }

    if (appointment?.barberId) {
      const barber = await BarberProfile.findById(appointment.barberId).select("userId");
      if (barber?.userId) {
        userIds.add(barber.userId.toString());
      }
    }

    for (const userId of userIds) {
      emitToUser(userId, event, {
        appointmentId: appointment._id,
        ...data,
      });
    }
  } catch (error) {
    logger.warn(`Unable to emit appointment notification: ${error.message}`);
  }
};
