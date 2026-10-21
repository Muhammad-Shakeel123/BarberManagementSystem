import Appointment from "../../models/appointment.model.js";
import Branch from "../../models/branch.model.js";
import BarberProfile from "../../models/barberProfile.model.js";
import Chair from "../../models/chair.model.js";
import moment from "moment-timezone";
import { SLOT_INTERVAL_MINUTES, TIMEZONE } from "../../constant.js";
import { ApiError } from "../../utils/ApiError.js";
import { calculateBranchSlots, isAppointmentOverlapping } from "./dashboard.helpers.js";

class DashboardSlotAnalyticsService {
  static async getSlotAnalytics({ date, branchId }) {
    const selectedDate = date
      ? moment.tz(date, TIMEZONE).startOf("day")
      : moment.tz(TIMEZONE).startOf("day");

    const branchQuery = { isActive: true };
    if (branchId) branchQuery._id = branchId;

    const branches = await Branch.find(branchQuery).lean();
    if (branchId && branches.length === 0) throw new ApiError(404, "Branch not found");

    let totalSlots = 0;
    let bookedSlots = 0;
    let availableSlots = 0;
    const branchAnalytics = [];

    for (const branch of branches) {
      const timezone = branch.timezone || TIMEZONE;
      const branchDate = selectedDate.clone().tz(timezone);
      const dayStart = branchDate.clone().startOf("day");
      const dayEnd = branchDate.clone().endOf("day");

      const chairs = await Chair.find({ branchId: branch._id })
        .select("name number type isOperational assignedBarberId")
        .populate({
          path: "assignedBarberId",
          select: "userId",
          populate: { path: "userId", select: "name" },
        })
        .lean();

      const operationalChairs = chairs.filter((chair) => chair.isOperational);

      const barbers = await BarberProfile.find({
        branchId: branch._id,
        isActive: true,
      }).populate("userId", "name").lean();

      const appointments = await Appointment.find({
        branchId: branch._id,
        startTime: { $gte: dayStart.toDate(), $lte: dayEnd.toDate() },
        status: { $nin: ["cancelled", "no_show"] },
      }).populate("barberId", "userId").populate("chairId", "name number").lean();

      const slots = calculateBranchSlots(branch, branchDate.toDate());
      const slotDetails = [];

      for (const slot of slots) {
        const overlappingAppointments = appointments.filter((appointment) =>
          isAppointmentOverlapping(appointment, slot.start, slot.end),
        );
        const booked = overlappingAppointments.length > 0;
        if (booked) bookedSlots++;
        else availableSlots++;

        slotDetails.push({
          start: slot.start,
          end: slot.end,
          label: slot.label,
          status: booked ? "booked" : "available",
          appointments: overlappingAppointments.length,
        });
      }

      const barberStats = barbers.map((barber) => {
        const barberAppointments = appointments.filter(
          (appointment) => appointment.barberId?._id?.toString() === barber._id.toString(),
        );
        return {
          barberId: barber._id,
          name: barber.userId?.name || "Unknown Barber",
          appointments: barberAppointments.length,
          bookedSlots: barberAppointments.reduce((total, appointment) => {
            const duration =
              (new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) /
              (1000 * 60);
            return total + Math.ceil(duration / SLOT_INTERVAL_MINUTES);
          }, 0),
        };
      });

      const chairStats = chairs.map((chair) => {
        const chairAppointments = appointments.filter(
          (appointment) => appointment.chairId?._id?.toString() === chair._id.toString(),
        );
        return {
          chairId: chair._id,
          name: chair.name,
          number: chair.number,
          type: chair.type,
          isOperational: chair.isOperational,
          appointments: chairAppointments.length,
          status: chair.isOperational
            ? chairAppointments.length > 0 ? "booked" : "available"
            : "unavailable",
        };
      });

      const branchTotalSlots = slots.length;
      const branchBookedSlots = slots.filter((slot) =>
        appointments.some((appointment) => isAppointmentOverlapping(appointment, slot.start, slot.end)),
      ).length;
      const branchAvailableSlots = branchTotalSlots - branchBookedSlots;
      const utilization =
        branchTotalSlots > 0 ? Number(((branchBookedSlots / branchTotalSlots) * 100).toFixed(1)) : 0;

      branchAnalytics.push({
        branchId: branch._id,
        branchName: branch.name,
        branchCode: branch.code,
        date: branchDate.format("YYYY-MM-DD"),
        slots: { total: branchTotalSlots, available: branchAvailableSlots, booked: branchBookedSlots, utilization },
        chairs: { total: chairs.length, operational: operationalChairs.length, unavailable: chairs.length - operationalChairs.length },
        barbers: { total: barbers.length },
        appointments: {
          total: appointments.length,
          completed: appointments.filter((appointment) => appointment.status === "completed").length,
          cancelled: appointments.filter((appointment) => appointment.status === "cancelled").length,
          inProgress: appointments.filter((appointment) => appointment.status === "in_progress").length,
        },
        barberStats,
        chairStats,
        slotDetails,
      });

      totalSlots += branchTotalSlots;
    }

    bookedSlots = branchAnalytics.reduce((total, branch) => total + branch.slots.booked, 0);
    availableSlots = totalSlots - bookedSlots;
    const utilization = totalSlots > 0 ? Number(((bookedSlots / totalSlots) * 100).toFixed(1)) : 0;

    return {
      date: selectedDate.format("YYYY-MM-DD"),
      summary: {
        totalSlots,
        availableSlots,
        bookedSlots,
        utilization,
        totalBranches: branchAnalytics.length,
        totalChairs: branchAnalytics.reduce((total, branch) => total + branch.chairs.total, 0),
        operationalChairs: branchAnalytics.reduce((total, branch) => total + branch.chairs.operational, 0),
        totalBarbers: branchAnalytics.reduce((total, branch) => total + branch.barbers.total, 0),
      },
      branches: branchAnalytics,
    };
  }
}

export default DashboardSlotAnalyticsService;
