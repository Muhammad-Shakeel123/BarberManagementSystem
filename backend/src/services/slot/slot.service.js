import SlotDurationService from "./slot.duration.service.js";
import SlotConflictService from "./slot.conflict.service.js";
import SlotAvailabilityService from "./slot.availability.service.js";
import SlotGenerationService from "./slot.generation.service.js";
import SlotQueryService from "./slot.query.service.js";
import { TIMEZONE } from "../../constant.js";

class SlotService {
  static calculateTotalDuration(...args) {
    return SlotDurationService.calculateTotalDuration(...args);
  }
  static isBarberFree(...args) {
    return SlotConflictService.isBarberFree(...args);
  }
  static isChairFree(...args) {
    return SlotConflictService.isChairFree(...args);
  }
  static hasCustomerOverlap(...args) {
    return SlotConflictService.hasCustomerOverlap(...args);
  }
  static checkBranchCapacity(...args) {
    return SlotConflictService.checkBranchCapacity(...args);
  }
  static isSlotAvailable(...args) {
    return SlotAvailabilityService.isSlotAvailable(...args);
  }
  static findAvailableChair(...args) {
    return SlotAvailabilityService.findAvailableChair(...args);
  }
  static generateSlots(...args) {
    return SlotGenerationService.generateSlots(...args);
  }
  static getBarberAppointments(...args) {
    return SlotQueryService.getBarberAppointments(...args);
  }
  static getChairAppointments(...args) {
    return SlotQueryService.getChairAppointments(...args);
  }

  static async findWalkInSlot(branchId, serviceIds, date, timezone = TIMEZONE) {
    const slots = await SlotGenerationService.generateSlots({
      branchId,
      serviceIds,
      date,
      timezone,
    });
    const available = slots.find((slot) => slot.available);
    if (!available) return null;
    return { start: new Date(available.start), end: new Date(available.end) };
  }
}

export default SlotService;
