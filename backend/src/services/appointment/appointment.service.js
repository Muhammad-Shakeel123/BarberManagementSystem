import AppointmentBookingService from "./appointment.booking.service.js";
import AppointmentRescheduleService from "./appointment.reschedule.service.js";
import AppointmentCancelService from "./appointment.cancel.service.js";
import AppointmentStatusService from "./appointment.status.service.js";
import AppointmentExtraService from "./appointment.extra-service.service.js";
import AppointmentQueryService from "./appointment.query.service.js";

class AppointmentService {
  static bookAppointment(...args) {
    return AppointmentBookingService.bookAppointment(...args);
  }

  static reschedule(...args) {
    return AppointmentRescheduleService.reschedule(...args);
  }

  static cancel(...args) {
    return AppointmentCancelService.cancel(...args);
  }

  static markNoShow(...args) {
    return AppointmentStatusService.markNoShow(...args);
  }

  static updateStatus(...args) {
    return AppointmentStatusService.updateStatus(...args);
  }

  static addExtraService(...args) {
    return AppointmentExtraService.addExtraService(...args);
  }

  static getAppointmentById(...args) {
    return AppointmentQueryService.getAppointmentById(...args);
  }

  static getCustomerAppointments(...args) {
    return AppointmentQueryService.getCustomerAppointments(...args);
  }

  static getBarberAppointments(...args) {
    return AppointmentQueryService.getBarberAppointments(...args);
  }

  static searchAppointments(...args) {
    return AppointmentQueryService.searchAppointments(...args);
  }

  static getBranchAppointments(...args) {
    return AppointmentQueryService.getBranchAppointments(...args);
  }

  static getBranchMonthlyAppointments(...args) {
    return AppointmentQueryService.getBranchMonthlyAppointments(...args);
  }

  static getActiveBranchAppointments(...args) {
    return AppointmentQueryService.getActiveBranchAppointments(...args);
  }
}

export default AppointmentService;
