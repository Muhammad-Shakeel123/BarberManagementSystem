import moment from "moment-timezone";
import { SLOT_INTERVAL_MINUTES, TIMEZONE } from "../../constant.js";

export const calculateBranchSlots = (branch, date) => {
  const timezone = branch.timezone || TIMEZONE;
  const targetDate = moment.tz(date, timezone).startOf("day");
  let startTime = branch.workingHours?.start;
  let endTime = branch.workingHours?.end;
  if (!startTime || !endTime) return [];

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const dayStart = targetDate.clone().set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
  const dayEnd = targetDate.clone().set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });
  const breaks = branch.workingHours?.breaks || [];
  const slots = [];
  let current = dayStart.clone();

  while (current.clone().add(SLOT_INTERVAL_MINUTES, "minutes").isSameOrBefore(dayEnd)) {
    let isBreak = false;
    for (const breakTime of breaks) {
      const [breakStartHour, breakStartMinute] = breakTime.start.split(":").map(Number);
      const [breakEndHour, breakEndMinute] = breakTime.end.split(":").map(Number);
      const breakStart = targetDate.clone().set({ hour: breakStartHour, minute: breakStartMinute, second: 0, millisecond: 0 });
      const breakEnd = targetDate.clone().set({ hour: breakEndHour, minute: breakEndMinute, second: 0, millisecond: 0 });
      if (current.isSameOrAfter(breakStart) && current.isBefore(breakEnd)) {
        isBreak = true;
        current = breakEnd.clone();
        break;
      }
    }
    if (isBreak) continue;

    const start = current.clone();
    const end = current.clone().add(SLOT_INTERVAL_MINUTES, "minutes");
    slots.push({ start: start.toDate(), end: end.toDate(), label: start.format("HH:mm") });
    current.add(SLOT_INTERVAL_MINUTES, "minutes");
  }
  return slots;
};

export const isAppointmentOverlapping = (appointment, start, end) =>
  appointment.startTime < end && appointment.endTime > start;
