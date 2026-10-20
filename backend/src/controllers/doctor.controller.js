const doctorService = require("../services/doctor.service");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../middlewares/error.middleware");

const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await doctorService.createDoctor(req.body);
  res.status(201).json(new ApiResponse(201, { doctor }, "Doctor profile created"));
});

const listDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorService.listDoctors({
    specialization: req.query.specialization,
  });
  res.status(200).json(new ApiResponse(200, { doctors }, "Doctors fetched"));
});

module.exports = { createDoctor, listDoctors };