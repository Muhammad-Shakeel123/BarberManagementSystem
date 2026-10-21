import Appointment from "../../models/appointment.model.js";
import BarberProfile from "../../models/barberProfile.model.js";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import moment from "moment-timezone";

class AppointmentQueryService {
  static async getAppointmentById(appointmentId, userId) {
    const appointment = await Appointment.findById(appointmentId)
      .populate("customerId", "name email phone")
      .populate("barberId")
      .populate("branchId")
      .populate("chairId")
      .populate("serviceIds");

    if (!appointment) throw new ApiError(404, "Appointment not found");

    const isAdmin = await this.isAdmin(userId);
    const isCustomer = appointment.customerId._id.toString() === userId;

    const barberProfile = await BarberProfile.findOne({ userId });
    const isBarber =
      barberProfile && barberProfile._id.toString() === appointment.barberId?.toString();

    if (!isAdmin && !isCustomer && !isBarber) {
      throw new ApiError(403, "Not authorized to view this appointment");
    }

    return appointment;
  }

  static async getCustomerAppointments(customerId, filters = {}) {
    const query = { customerId };

    if (filters.status) query.status = filters.status;

    if (filters.from || filters.to) {
      query.startTime = {};
      if (filters.from) query.startTime.$gte = filters.from;
      if (filters.to) query.startTime.$lte = filters.to;
    }

    return Appointment.find(query)
      .populate("customerId", "name email phone")
      .populate("barberId", "userId")
      .populate("branchId", "name")
      .populate("serviceIds", "name duration price")
      .sort({ startTime: 1 });
  }

  static async getBarberAppointments(barberId, filters = {}) {
    const query = { barberId };

    if (filters.status) query.status = filters.status;

    if (filters.from || filters.to) {
      query.startTime = {};
      if (filters.from) query.startTime.$gte = filters.from;
      if (filters.to) query.startTime.$lte = filters.to;
    }

    return Appointment.find(query)
      .populate("customerId", "name email phone")
      .populate("branchId", "name")
      .populate("serviceIds", "name duration price")
      .sort({ startTime: 1 });
  }

  static async searchAppointments(user, searchTerm) {
    const normalizedSearch = String(searchTerm || "")
      .trim()
      .toLowerCase();
    if (!normalizedSearch) return [];

    const query = {};

    if (user.role === "customer") {
      query.customerId = user.id;
    } else if (user.role === "barber") {
      const barber = await BarberProfile.findOne({ userId: user.id }).select("_id");
      if (!barber) return [];
      query.barberId = barber._id;
    }

    const appointments = await Appointment.find(query)
      .populate("customerId", "name email phone")
      .populate("barberId", "userId")
      .populate("branchId", "name code")
      .populate("serviceIds", "name duration")
      .sort({ startTime: -1 })
      .limit(100);

    return appointments
      .filter((appointment) => {
        const searchableText = [
          appointment.customerId?.name,
          appointment.customerId?.email,
          appointment.customerId?.phone,
          appointment.branchId?.name,
          appointment.branchId?.code,
          appointment.status,
          ...(appointment.serviceIds || []).map((service) => service.name),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .slice(0, 20);
  }

  static async getBranchAppointments(branchId, filters = {}) {
    const query = { branchId };

    if (filters.status) query.status = filters.status;

    if (filters.date) {
      const date = moment(filters.date).startOf("day");
      const nextDay = date.clone().add(1, "day");

      query.startTime = {
        $gte: date.toDate(),
        $lt: nextDay.toDate(),
      };
    }

    const appointments = await Appointment.find(query)
      .populate("customerId", "name email phone")
      .populate("barberId", "userId")
      .populate("chairId", "name number")
      .populate("serviceIds", "name duration price")
      .sort({ startTime: 1 });

    return appointments;
  }
  static async getBranchMonthlyAppointments(branchId) {
    const startOfMonth = moment().startOf("month");
    const startOfNextMonth = startOfMonth.clone().add(1, "month");

    const query = {
      branchId,
      startTime: {
        $gte: startOfMonth.toDate(),
        $lt: startOfNextMonth.toDate(),
      },
    };

    return Appointment.find(query)
      .populate("customerId", "name email phone")
      .populate("barberId", "userId")
      .populate("chairId", "name number")
      .populate("serviceIds", "name duration price")
      .sort({ startTime: 1 });
  }

  static async getActiveBranchAppointments(branchId) {
    const query = {
      branchId,
      status: {
        $in: ["booked", "in_progress"],
      },
    };

    return Appointment.find(query)
      .populate("customerId", "name email phone")
      .populate("barberId", "userId")
      .populate("chairId", "name number")
      .populate("serviceIds", "name duration price")
      .sort({ startTime: 1 });
  }

  static async isAdmin(userId) {
    const user = await User.findById(userId);
    return !!user && user.role === "admin";
  }
}

export default AppointmentQueryService;
