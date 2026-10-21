import AppointmentService from "../services/appointment/appointment.service.js";
import SlotService from "../services/slot/slot.service.js";
import AppointmentAccessService from "../services/appointment/appointment.access.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const bookAppointment = asyncHandler(async (req, res) => {
  const idempotencyKey = req.headers["idempotency-key"];
  const appointment = await AppointmentService.bookAppointment(
    {
      ...req.body,
      customerId: req.user.role === "admin" ? req.body.customerId : req.user.id,
    },
    idempotencyKey,
    req.user.id,
  );
  res.status(201).json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});

export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const appointment = await AppointmentService.reschedule(
    req.params.id,
    req.body.newStartTime,
    req.body.reason,
    req.user.role === "admin" ? null : req.user.id,
  );
  res.json(new ApiResponse(200, appointment, "Appointment rescheduled successfully"));
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await AppointmentService.cancel(
    req.params.id,
    req.user.id,
    req.user.role === "admin",
  );
  res.json(new ApiResponse(200, appointment, "Appointment cancelled successfully"));
});

export const updateStatus = asyncHandler(async (req, res) => {
  const appointment = await AppointmentService.updateStatus(
    req.params.id,
    req.body.status,
    req.user.id,
  );
  res.json(new ApiResponse(200, appointment, "Status updated successfully"));
});

export const addExtraService = asyncHandler(async (req, res) => {
  const appointment = await AppointmentService.addExtraService(
    req.params.id,
    req.body.serviceId,
    req.user.id,
  );
  res.json(new ApiResponse(200, appointment, "Service added successfully"));
});

export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { branchId, barberId, serviceIds, date, timezone } = req.query;
  if (!branchId || !serviceIds || !date) {
    throw new ApiError(400, "branchId, serviceIds, and date are required");
  }

  const slots = await SlotService.generateSlots({
    branchId,
    barberId: barberId || undefined,
    serviceIds: serviceIds.split(","),
    date,
    timezone: timezone || undefined,
  });
  res.json(new ApiResponse(200, slots, "Slots generated successfully"));
});

export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await AppointmentService.getCustomerAppointments(req.user.id, {
    status: req.query.status,
    from: req.query.from,
    to: req.query.to,
  });
  res.json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
});

export const searchAppointments = asyncHandler(async (req, res) => {
  const appointments = await AppointmentService.searchAppointments(req.user, req.query.q);

  res.json(new ApiResponse(200, appointments, "Appointments searched successfully"));
});

export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await AppointmentService.getAppointmentById(req.params.id, req.user.id);
  res.json(new ApiResponse(200, appointment, "Appointment fetched successfully"));
});

export const getBarberAppointments = asyncHandler(async (req, res) => {
  const { barberId } = req.params;
  await AppointmentAccessService.assertBarberAppointmentsAccess({ user: req.user, barberId });

  const appointments = await AppointmentService.getBarberAppointments(barberId, {
    status: req.query.status,
    from: req.query.from,
    to: req.query.to,
  });
  res.json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
});

export const getBranchAppointments = asyncHandler(async (req, res) => {
  const appointments = await AppointmentService.getBranchAppointments(req.params.branchId, {
    status: req.query.status,
    date: req.query.date,
  });
  res.json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
});

export const getBranchMonthlyAppointments = asyncHandler(async (req, res) => {
  const appointments = await AppointmentService.getBranchMonthlyAppointments(req.params.branchId);
  res.json(new ApiResponse(200, appointments, "Monthly appointments fetched successfully"));
});

export const getActiveBranchAppointments = asyncHandler(async (req, res) => {
  const appointments = await AppointmentService.getActiveBranchAppointments(req.params.branchId);
  res.json(new ApiResponse(200, appointments, "Active appointments fetched successfully"));
});
