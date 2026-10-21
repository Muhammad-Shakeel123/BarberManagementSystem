import User from "../../models/user.model.js";
import { generateAccessToken } from "../../utils/generateTokens.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../config/logger.js";

class AuthService {
  static async register({ name, email, password, phone, role }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) throw new ApiError(400, "User already exists with this email");

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: role || "customer",
    });
    await user.save();

    const token = generateAccessToken(user._id, user.role);
    logger.info(`New user registered: ${user.email}`);
    return { user: user.toJSON(), token };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) throw new ApiError(401, "Invalid email or password");
    if (!user.isActive) throw new ApiError(401, "Account is deactivated");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateAccessToken(user._id, user.role);
    logger.info(`User logged in: ${user.email}`);
    return { user: user.toJSON(), token };
  }
}

export default AuthService;
