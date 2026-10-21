import moment from "moment-timezone";
import Service from "../../../models/service.model.js";
import Branch from "../../../models/branch.model.js";
import BarberProfile from "../../../models/barberProfile.model.js";
import SlotService from "../../slot/slot.service.js";
import { ApiError } from "../../../utils/ApiError.js";

class AppointmentBookingValidationService {
  static async prepare({
    branchId,
    barberId,
    serviceIds,
    startTime,
    customerId,
    chairId,
    isWalkIn = false,
  }) {
    const startTimeDate = new Date(startTime);
    if (Number.isNaN(startTimeDate.getTime())) throw new ApiError(400, "Invalid startTime");

    const services = await Service.find({
      _id: { $in: serviceIds },
      isActive: true,
    });
    if (services.length !== serviceIds.length) {
      throw new ApiError(400, "One or more services are invalid or inactive");
    }

    const totalDuration = await SlotService.calculateTotalDuration(serviceIds, branchId);
    const endTime = moment(startTimeDate).add(totalDuration, "minutes").toDate();

    const totalAmount = services.reduce((sum, service) => sum + service.price, 0);
    const depositAmount = services.reduce((sum, service) => sum + (service.deposit || 0), 0);
    const chairTypeRequired = services.some((service) => service.chairTypeRequired)
      ? services.find((service) => service.chairTypeRequired)?.chairTypeRequired
      : null;

    const branch = await Branch.findById(branchId);
    if (!branch) throw new ApiError(404, "Branch not found");
    if (!branch.isActive) throw new ApiError(400, "Branch is not active");

    const day = moment(startTimeDate).startOf("day").toDate();
    if (branch.offDates?.some((d) => moment(d).isSame(day, "day"))) {
      throw new ApiError(400, "Branch is closed on this date");
    }

    const startM = moment(startTimeDate);
    const endM = moment(endTime);
    const [startHour, startMinute] = branch.workingHours.start.split(":").map(Number);
    const [endHour, endMinute] = branch.workingHours.end.split(":").map(Number);

    const dayStart = moment(startTimeDate).set({
      hour: startHour,
      minute: startMinute,
      second: 0,
      millisecond: 0,
    });
    const dayEnd = moment(startTimeDate).set({
      hour: endHour,
      minute: endMinute,
      second: 0,
      millisecond: 0,
    });

    if (startM.isBefore(dayStart) || endM.isAfter(dayEnd)) {
      throw new ApiError(400, "Appointment time is outside working hours");
    }

    const now = moment();
    if (!isWalkIn && startM.diff(now, "minutes") < 30) {
      throw new ApiError(400, "Advance booking must be at least 30 minutes");
    }
    if (startM.diff(now, "days") > 30) {
      throw new ApiError(400, "Cannot book more than 30 days in advance");
    }

    if (barberId) {
      const barber = await BarberProfile.findById(barberId);
      if (!barber) throw new ApiError(404, "Barber not found");
      if (!barber.isActive) throw new ApiError(400, "Barber is not active");

      if (
        barber.branchId.toString() !== branchId &&
        !(barber.branches || []).some((b) => b.toString() === branchId)
      ) {
        throw new ApiError(400, "Barber does not work at this branch");
      }

      if (barber.specialties?.length > 0) {
        const canPerform = serviceIds.every((serviceId) =>
          barber.specialties.some((specialty) => specialty.toString() === serviceId.toString()),
        );
        if (!canPerform) {
          throw new ApiError(400, "Barber is not qualified for one or more services");
        }
      }

      if (barber.offDates?.some((d) => moment(d).isSame(day, "day"))) {
        throw new ApiError(400, "Barber is off on this date");
      }
    }

    return {
      branchId,
      barberId,
      serviceIds,
      startTimeDate,
      endTime,
      customerId,
      chairId,
      isWalkIn,
      totalAmount,
      depositAmount,
      chairTypeRequired,
    };
  }
}

export default AppointmentBookingValidationService;
