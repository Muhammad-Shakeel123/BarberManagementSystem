import Payment from "../../../models/payment.model.js";
import logger from "../../../config/logger.js";

class AppointmentExtraServicePersistenceService {
  static async update({ appointment, service, serviceId, appointmentId, userId, newEndTime }) {
    appointment.serviceIds.push(serviceId);
    appointment.endTime = newEndTime;
    appointment.totalAmount += service.price;

    if (appointment.paymentId) {
      const payment = await Payment.findById(appointment.paymentId);
      if (payment) {
        payment.amount += service.price;
        await payment.save();
      }
    }

    await appointment.save();

    logger.info(
      `Extra service ${serviceId} added to appointment ${appointmentId} by user ${userId}`,
    );

    return appointment;
  }
}

export default AppointmentExtraServicePersistenceService;
