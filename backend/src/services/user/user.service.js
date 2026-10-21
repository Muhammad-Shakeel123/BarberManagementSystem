import User from "../../models/user.model.js";
import BarberProfile from "../../models/barberProfile.model.js";
import Appointment from "../../models/appointment.model.js";
import { ApiError } from "../../utils/ApiError.js";

class UserService {

 static async updateMe(user, { name, phone, preferences }) {
  if (name) user.name = name;
  if (phone) user.phone = phone;

  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences };
  }

  await user.save();

  return user.toJSON();
}

  static async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current password and new password are required");
    }

    if (newPassword.length < 6) {
      throw new ApiError(400, "New password must be at least 6 characters long");
    }

    const user = await User.findById(userId).select("+password");
    if (!user) throw new ApiError(404, "User not found");

    const matches = await user.comparePassword(currentPassword);
    if (!matches) throw new ApiError(400, "Current password is incorrect");

    user.password = newPassword;
    await user.save();

    return user.toJSON();
  }

  static async updateAvatar(userId, profileImage) {
    if (!profileImage) throw new ApiError(400, "Profile image is required");

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) throw new ApiError(404, "User not found");

    return user.toJSON();
  }

  static async removeAvatar(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: null },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) throw new ApiError(404, "User not found");

    return user.toJSON();
  }

  static async createCustomer({ name, email, phone }) {
    if (!name || !email) throw new ApiError(400, "Name and email are required");

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) throw new ApiError(400, "User already exists with this email");

    const temporaryPassword = `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    const customer = new User({
      name,
      email: normalizedEmail,
      phone,
      password: temporaryPassword,
      role: "customer",
    });
    await customer.save();
    return customer.toJSON();
  }

  static async getAll({ role, isActive } = {}) {
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";
    return User.find(query).select("-password");
  }

  static async update(id, { name, phone, role, isActive, preferences }) {
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    await user.save();
    return user.toJSON();
  }

  static async remove(id) {
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    const activeAppointments = await Appointment.countDocuments({
      customerId: id,
      status: { $in: ["booked", "confirmed", "in_progress"] },
    });
    if (activeAppointments > 0) {
      throw new ApiError(400, `User has ${activeAppointments} active appointments. Cannot delete.`);
    }

    user.isActive = false;
    await user.save();
  }
}

export default UserService;
