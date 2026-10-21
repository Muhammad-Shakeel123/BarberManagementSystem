import BarberProfile from "../../models/barberProfile.model.js";
import { ApiError } from "../../utils/ApiError.js";

class AppointmentAccessService {
  static async assertBarberAppointmentsAccess({ user, barberId }) {
    if (user.role === "admin") return;

    const barberProfile = await BarberProfile.findOne({ userId: user.id });
    if (!barberProfile || barberProfile._id.toString() !== barberId) {
      throw new ApiError(403, "Not authorized");
    }
  }
}

export default AppointmentAccessService;
