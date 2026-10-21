import AppointmentExtraServiceValidationService from "./extra/appointment.extra-service.validation.service.js";
import AppointmentExtraServicePersistenceService from "./extra/appointment.extra-service.persistence.service.js";

class AppointmentExtraService {
  static async addExtraService(appointmentId, serviceId, userId) {
    const context = await AppointmentExtraServiceValidationService.prepare(
      appointmentId,
      serviceId,
    );

    return AppointmentExtraServicePersistenceService.update({
      ...context,
      serviceId,
      appointmentId,
      userId,
    });
  }
}

export default AppointmentExtraService;
