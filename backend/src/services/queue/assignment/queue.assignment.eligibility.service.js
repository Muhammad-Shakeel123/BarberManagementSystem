import BarberProfile from "../../../models/barberProfile.model.js";
import Service from "../../../models/service.model.js";
import SlotService from "../../slot/slot.service.js";
import moment from "moment-timezone";
import { TIMEZONE } from "../../../constant.js";

class QueueAssignmentEligibilityService {
  static async getRequiredChairType(serviceIds) {
    const services = await Service.find({ _id: { $in: serviceIds }, isActive: true });
    if (services.length !== serviceIds.length) {
      throw new Error("One or more services are invalid or inactive");
    }
    return services.find((service) => service.chairTypeRequired)?.chairTypeRequired || null;
  }

  static barberWorksAtBranch(barber, branchId) {
    if (!barber || !branchId) return false;
    const barberBranchId = barber.branchId?.toString();
    if (barberBranchId === branchId.toString()) return true;
    return (barber.branches || []).some(
      (branch) => (branch?._id || branch)?.toString() === branchId.toString(),
    );
  }

  static canBarberPerformServices(barber, serviceIds) {
    if (!barber) return false;
    if (!barber.specialties?.length) return true;
    return serviceIds.every((serviceId) =>
      barber.specialties.some(
        (specialty) => (specialty?._id || specialty)?.toString() === serviceId.toString(),
      ),
    );
  }

  static async getEligibleBarber({ branchId, barberId, serviceIds }) {
    if (!barberId) return null;
    const barber = await BarberProfile.findOne({ _id: barberId, isActive: true });
    if (!barber) return null;
    if (!this.barberWorksAtBranch(barber, branchId)) return null;
    if (!this.canBarberPerformServices(barber, serviceIds)) return null;
    return barber;
  }

  static async findNextSlotForBarber({ branchId, barberId, serviceIds, fromTime }) {
    const date = moment.tz(fromTime, TIMEZONE).format("YYYY-MM-DD");
    const slots = await SlotService.generateSlots({
      branchId, barberId, serviceIds, date, timezone: TIMEZONE,
    });
    return slots.find(
      (slot) => slot.available && new Date(slot.start).getTime() >= fromTime.getTime(),
    ) || null;
  }

  static async findBarberAndSlot({ branchId, requestedBarberId, serviceIds, fromTime }) {
    const checkedBarbers = new Set();

    if (requestedBarberId) {
      const requestedBarber = await this.getEligibleBarber({
        branchId, barberId: requestedBarberId, serviceIds,
      });
      if (requestedBarber) {
        checkedBarbers.add(requestedBarber._id.toString());
        const slot = await this.findNextSlotForBarber({
          branchId, barberId: requestedBarber._id, serviceIds, fromTime,
        });
        if (slot) return { barber: requestedBarber, slot };
      }
    }

    const barbers = await BarberProfile.find({
      isActive: true,
      $or: [{ branchId }, { branches: branchId }],
    }).sort({ _id: 1 });

    for (const barber of barbers) {
      const barberKey = barber._id.toString();
      if (checkedBarbers.has(barberKey)) continue;
      checkedBarbers.add(barberKey);
      if (!this.canBarberPerformServices(barber, serviceIds)) continue;

      const slot = await this.findNextSlotForBarber({
        branchId, barberId: barber._id, serviceIds, fromTime,
      });
      if (slot) return { barber, slot };
    }
    return null;
  }

  static async findChair({ branchId, serviceIds, startTime, endTime }) {
    const chairTypeRequired = await this.getRequiredChairType(serviceIds);
    return SlotService.findAvailableChair(branchId, startTime, endTime, chairTypeRequired);
  }
}

export default QueueAssignmentEligibilityService;
