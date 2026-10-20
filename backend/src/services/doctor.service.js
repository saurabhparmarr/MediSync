const Doctor = require("../models/doctor.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { ROLES } = require("../constants");

const createDoctor = async ({ userId, specialization, consultationFee, bio }) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role !== ROLES.PATIENT) {
    throw new ApiError(409, "User is already a doctor or admin");
  }

  const doctor = await Doctor.create({
    user: user._id,
    specialization,
    consultationFee,
    bio,
  });

  await User.updateOne({ _id: user._id }, { role: ROLES.DOCTOR });

  return doctor;
};

const listDoctors = async ({ specialization }) => {
  const filter = specialization ? { specialization } : {};
  return Doctor.find(filter).populate("user", "name").sort({ createdAt: -1 });
};

module.exports = { createDoctor, listDoctors };