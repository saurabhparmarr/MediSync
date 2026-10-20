const Slot = require("../models/slot.model");
const Doctor = require("../models/doctor.model");
const ApiError = require("../utils/ApiError");
const { SLOT_STATUS } = require("../constants");

const createSlot = async ({ userId, startTime, endTime }) => {
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) throw new ApiError(404, "Doctor profile not found");

  const overlapping = await Slot.findOne({
    doctor: doctor._id,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });
  if (overlapping) throw new ApiError(409, "Slot overlaps with an existing slot");

  return Slot.create({ doctor: doctor._id, startTime, endTime });
};

const listAvailableSlots = async ({ doctorId, from }) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  return Slot.find({
    doctor: doctorId,
    status: SLOT_STATUS.AVAILABLE,
    startTime: { $gte: from || new Date() },
  })
    .sort({ startTime: 1 })
    .limit(100);
};

module.exports = { createSlot, listAvailableSlots };