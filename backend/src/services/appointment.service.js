const mongoose = require("mongoose");
const Slot = require("../models/slot.model");
const Appointment = require("../models/appointment.model");
const ApiError = require("../utils/ApiError");
const { SLOT_STATUS, APPOINTMENT_STATUS } = require("../constants");

const bookAppointment = async ({ patientId, slotId }) => {
  const session = await mongoose.startSession();
  try {
    let appointment;

    await session.withTransaction(async () => {
      const slot = await Slot.findOneAndUpdate(
        {
          _id: slotId,
          status: SLOT_STATUS.AVAILABLE,
          startTime: { $gt: new Date() },
        },
        { $set: { status: SLOT_STATUS.BOOKED } },
        { new: true, session }
      );

      if (!slot) throw new ApiError(409, "Slot is not available");

      const [created] = await Appointment.create(
        [
          {
            patient: patientId,
            doctor: slot.doctor,
            slot: slot._id,
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
        ],
        { session }
      );
      appointment = created;
    });

    return appointment;
  } finally {
    await session.endSession();
  }
};

const cancelAppointment = async ({ appointmentId, patientId }) => {
  const session = await mongoose.startSession();
  try {
    let appointment;

    await session.withTransaction(async () => {
      appointment = await Appointment.findOneAndUpdate(
        {
          _id: appointmentId,
          patient: patientId,
          status: APPOINTMENT_STATUS.BOOKED,
        },
        { $set: { status: APPOINTMENT_STATUS.CANCELLED } },
        { new: true, session }
      );

      if (!appointment) {
        throw new ApiError(404, "Appointment not found or already cancelled");
      }

      await Slot.updateOne(
        { _id: appointment.slot },
        { $set: { status: SLOT_STATUS.AVAILABLE } },
        { session }
      );
    });

    return appointment;
  } finally {
    await session.endSession();
  }
};

const listMyAppointments = async ({ patientId }) =>
  Appointment.find({ patient: patientId })
    .populate("doctor", "specialization consultationFee")
    .sort({ startTime: 1 });

module.exports = { bookAppointment, cancelAppointment, listMyAppointments };