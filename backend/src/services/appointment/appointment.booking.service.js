import Payment from "../../models/payment.model.js";
import Appointment from "../../models/appointment.model.js";
import logger from "../../config/logger.js";
import AppointmentBookingValidationService from "./booking/appointment.booking.validation.service.js";
import AppointmentBookingPersistenceService from "./booking/appointment.booking.persistence.service.js";

class AppointmentBookingService {
  static async bookAppointment(data, idempotencyKey, userId) {
    if (idempotencyKey) {
      const existingPayment = await Payment.findOne({ idempotencyKey });
      if (existingPayment) {
        const existingAppt = await Appointment.findById(existingPayment.appointmentId);
        if (existingAppt) {
          logger.info(`Idempotent request: returning existing appointment ${existingAppt._id}`);
          return existingAppt;
        }
      }
    }

    const {
      branchId,
      barberId,
      serviceIds,
      startTime,
      customerId,
      chairId,
      notes,
      isWalkIn = false,
      createPayment = true,
    } = data;

    const context = await AppointmentBookingValidationService.prepare({
      branchId,
      barberId,
      serviceIds,
      startTime,
      customerId,
      chairId,
      isWalkIn,
    });
    context.notes = notes;

    return AppointmentBookingPersistenceService.create({
      context,
      idempotencyKey,
      createPayment,
      customerId,
    });
  }
}

export default AppointmentBookingService;
