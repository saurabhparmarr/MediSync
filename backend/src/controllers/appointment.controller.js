const appointmentService = require("../services/appointment.service");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../middlewares/error.middleware");

const bookAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.bookAppointment({
    patientId: req.user._id,
    slotId: req.body.slotId,
  });
  res.status(201).json(new ApiResponse(201, { appointment }, "Appointment booked"));
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.cancelAppointment({
    appointmentId: req.params.id,
    patientId: req.user._id,
  });
  res.status(200).json(new ApiResponse(200, { appointment }, "Appointment cancelled"));
});

const listMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.listMyAppointments({
    patientId: req.user._id,
  });
  res.status(200).json(new ApiResponse(200, { appointments }, "Appointments fetched"));
});

module.exports = { bookAppointment, cancelAppointment, listMyAppointments };