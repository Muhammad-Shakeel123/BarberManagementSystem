import Appointment from "../../../models/appointment.model.js";
import Service from "../../../models/service.model.js";
import BarberProfile from "../../../models/barberProfile.model.js";
import Branch from "../../../models/branch.model.js";
import StateMachine from "../../stateMachine.service.js";
import SlotService from "../../slot/slot.service.js";
import moment from "moment-timezone";
import { ApiError } from "../../../utils/ApiError.js";
import { TIMEZONE } from "../../../constant.js";

class AppointmentExtraServiceValidationService {
  static async prepare(appointmentId, serviceId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new ApiError(404, "Appointment not found");
    if (!StateMachine.isEditable(appointment.status)) {
      throw new ApiError(400, "Extra service cannot be added at this appointment stage");
    }

    const service = await Service.findById(serviceId);
    if (!service) throw new ApiError(404, "Service not found");
    if (!service.isActive) throw new ApiError(400, "Service is not active");

    const alreadyAdded = appointment.serviceIds.some(
      (id) => id.toString() === serviceId.toString(),
    );
    if (alreadyAdded) {
      throw new ApiError(409, "This service is already added to the appointment");
    }

    const extraDuration = await SlotService.calculateTotalDuration(
      [serviceId], appointment.branchId,
    );
    if (!extraDuration || extraDuration <= 0) {
      throw new ApiError(400, "Unable to calculate extra service duration");
    }

    const currentEndTime = appointment.endTime;
    const newEndTime = moment(currentEndTime).add(extraDuration, "minutes").toDate();

    const barber = await BarberProfile.findById(appointment.barberId);
    if (!barber) throw new ApiError(404, "Barber not found");
    if (!barber.isActive) throw new ApiError(400, "Barber is not active");

    const branch = await Branch.findById(appointment.branchId);
    if (!branch) throw new ApiError(404, "Branch not found");

    const timezone = branch.timezone || TIMEZONE;
    const appointmentDate = moment.tz(appointment.startTime, timezone).format("YYYY-MM-DD");

    const dayStart = moment.tz(appointmentDate, timezone).set({
      hour: Number(branch.workingHours.start.split(":")[0]),
      minute: Number(branch.workingHours.start.split(":")[1]),
      second: 0, millisecond: 0,
    });
    const dayEnd = moment.tz(appointmentDate, timezone).set({
      hour: Number(branch.workingHours.end.split(":")[0]),
      minute: Number(branch.workingHours.end.split(":")[1]),
      second: 0, millisecond: 0,
    });

    if (barber.workingHours?.start) {
      const [hour, minute] = barber.workingHours.start.split(":").map(Number);
      dayStart.set({ hour, minute, second: 0, millisecond: 0 });
    }
    if (barber.workingHours?.end) {
      const [hour, minute] = barber.workingHours.end.split(":").map(Number);
      dayEnd.set({ hour, minute, second: 0, millisecond: 0 });
    }

    const newEndMoment = moment.tz(newEndTime, timezone);
    if (newEndMoment.isBefore(dayStart) || newEndMoment.isAfter(dayEnd)) {
      throw new ApiError(409, "Adding this service exceeds the barber's working hours");
    }

    const barberFree = await SlotService.isBarberFree(
      appointment.barberId, currentEndTime, newEndTime, appointment._id,
    );
    if (!barberFree) {
      throw new ApiError(409, "Adding this service conflicts with another appointment");
    }

    if (appointment.chairId) {
      const chairFree = await SlotService.isChairFree(
        appointment.chairId, currentEndTime, newEndTime, appointment._id,
      );
      if (!chairFree) {
        throw new ApiError(409, "Adding this service conflicts with another chair booking");
      }
    }

    const branchCapacity = await SlotService.checkBranchCapacity(
      appointment.branchId, currentEndTime, newEndTime, appointment._id,
    );
    if (!branchCapacity) {
      throw new ApiError(409, "Branch capacity is not available for the extra service");
    }

    return { appointment, service, currentEndTime, newEndTime };
  }
}

export default AppointmentExtraServiceValidationService;
