import moment from "moment-timezone";
import Branch from "../../models/branch.model.js";
import BarberProfile from "../../models/barberProfile.model.js";
import Service from "../../models/service.model.js";
import SlotDurationService from "./slot.duration.service.js";
import SlotAvailabilityService from "./slot.availability.service.js";
import { SLOT_INTERVAL_MINUTES, TIMEZONE } from "../../constant.js";

class SlotGenerationService {
  static async generateSlots({
    branchId,
    barberId = null,
    serviceIds,
    date,
    timezone = TIMEZONE,
    interval = SLOT_INTERVAL_MINUTES,
  }) {
    const branch = await Branch.findById(branchId);
    if (!branch) throw new Error("Branch not found");

    let barber = null;
    if (barberId) {
      barber = await BarberProfile.findById(barberId);
      if (!barber) throw new Error("Barber not found");
      if (!barber.isActive) throw new Error("Barber is not active");
    }

    const services = await Service.find({
      _id: { $in: serviceIds },
      isActive: true,
    });
    if (services.length !== serviceIds.length) {
      throw new Error("One or more services are invalid or inactive");
    }

    const totalDuration = await SlotDurationService.calculateTotalDuration(serviceIds, branchId);
    const chairTypeRequired =
      services.find((service) => service.chairTypeRequired)?.chairTypeRequired || null;

    const today = moment.tz(timezone).startOf("day");
    const maxDaysAdvance = branch.settings?.maxDaysAdvance ?? 30;
    const targetDate = moment.tz(date, timezone).startOf("day");

    if (!targetDate.isValid()) throw new Error("Invalid booking date");
    if (targetDate.isBefore(today)) throw new Error("Booking date cannot be in the past");

    const maxBookingDate = today.clone().add(maxDaysAdvance, "days");
    if (targetDate.isAfter(maxBookingDate)) {
      throw new Error(`Booking date cannot be more than ${maxDaysAdvance} days in advance`);
    }

    const branchClosed = branch.offDates?.some((d) => moment(d).isSame(targetDate, "day"));
    if (branchClosed) return [];

    const barberOff = barber?.offDates?.some((d) => moment(d).isSame(targetDate, "day"));
    if (barberOff) return [];

    let startHour = branch.workingHours.start;
    let endHour = branch.workingHours.end;
    let breaks = branch.workingHours.breaks || [];

    if (barber?.workingHours) {
      startHour = barber.workingHours.start || startHour;
      endHour = barber.workingHours.end || endHour;
      breaks = barber.workingHours.breaks || breaks;
    }

    const [startHourValue, startMinuteValue] = startHour.split(":").map(Number);
    const [endHourValue, endMinuteValue] = endHour.split(":").map(Number);

    const dayStart = targetDate.clone().set({
      hour: startHourValue, minute: startMinuteValue, second: 0, millisecond: 0,
    });
    const dayEnd = targetDate.clone().set({
      hour: endHourValue, minute: endMinuteValue, second: 0, millisecond: 0,
    });

    const slots = [];
    const now = moment.tz(timezone);
    let current = dayStart.clone();

    while (current.clone().add(totalDuration, "minutes").isSameOrBefore(dayEnd)) {
      let inBreak = false;

      if (targetDate.isSame(now, "day") && current.isBefore(now)) {
        current.add(interval, "minutes");
        continue;
      }

      for (const br of breaks) {
        const [brStartHour, brStartMinute] = br.start.split(":").map(Number);
        const [brEndHour, brEndMinute] = br.end.split(":").map(Number);

        const brStart = targetDate.clone().set({
          hour: brStartHour, minute: brStartMinute, second: 0, millisecond: 0,
        });
        const brEnd = targetDate.clone().set({
          hour: brEndHour, minute: brEndMinute, second: 0, millisecond: 0,
        });

        if (current.isBetween(brStart, brEnd, null, "[)")) {
          inBreak = true;
          current = brEnd.clone();
          break;
        }
      }

      if (inBreak) continue;

      const start = current.toDate();
      const end = current.clone().add(totalDuration, "minutes").toDate();
      const available = await SlotAvailabilityService.isSlotAvailable({
        branchId,
        barberId: barberId || undefined,
        start,
        end,
        chairType: chairTypeRequired,
      });

      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
        available,
        duration: totalDuration,
      });

      current.add(interval, "minutes");
    }

    return slots;
  }
}

export default SlotGenerationService;
