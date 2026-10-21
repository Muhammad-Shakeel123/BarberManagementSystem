import Appointment from "../../models/appointment.model.js";
import User from "../../models/user.model.js";
import Branch from "../../models/branch.model.js";
import Service from "../../models/service.model.js";
import Payment from "../../models/payment.model.js";
import { calculateBranchSlots } from "./dashboard.helpers.js";

class DashboardAdminService {
  static async getDashboardStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const branches = await Branch.find({ isActive: true }).select("workingHours timezone");
    const totalSlots = branches.reduce(
      (total, branch) => total + calculateBranchSlots(branch, today).length,
      0,
    );

    const stats = {
      totalUsers: await User.countDocuments({ isActive: true }),
      totalBarbers: await User.countDocuments({ role: "barber", isActive: true }),
      totalBranches: await Branch.countDocuments({ isActive: true }),
      totalServices: await Service.countDocuments({ isActive: true }),
      totalSlots,
      todayAppointments: await Appointment.countDocuments({
        startTime: { $gte: today },
        status: { $nin: ["cancelled", "no_show"] },
      }),
      thisMonthAppointments: await Appointment.countDocuments({
        startTime: { $gte: startOfMonth },
        status: { $nin: ["cancelled", "no_show"] },
      }),
      activeAppointments: await Appointment.countDocuments({ status: "in_progress" }),
      revenueThisMonth: await Payment.aggregate([
        { $match: { status: "paid", paidAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      appointmentsByStatus: await Appointment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    };

    return stats;
  }
}

export default DashboardAdminService;
