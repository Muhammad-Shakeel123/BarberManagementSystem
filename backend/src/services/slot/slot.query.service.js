import Appointment from "../../models/appointment.model.js";
import moment from "moment-timezone";
import { APPOINTMENT_STATUS, TIMEZONE } from "../../constant.js";

class SlotQueryService {
  static async getBarberAppointments(barberId, date, timezone = TIMEZONE) {
    const start = moment.tz(date, timezone).startOf("day").toDate();
    const end = moment.tz(date, timezone).endOf("day").toDate();
    return Appointment.find({
      barberId,
      startTime: { $gte: start, $lte: end },
      status: { $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW] },
    }).sort({ startTime: 1 });
  }

  static async getChairAppointments(chairId, date, timezone = TIMEZONE) {
    const start = moment.tz(date, timezone).startOf("day").toDate();
    const end = moment.tz(date, timezone).endOf("day").toDate();
    return Appointment.find({
      chairId,
      startTime: { $gte: start, $lte: end },
      status: { $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW] },
    }).sort({ startTime: 1 });
  }
}

export default SlotQueryService;
