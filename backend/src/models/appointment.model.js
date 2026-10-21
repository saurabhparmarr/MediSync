const mongoose = require("mongoose");
const { APPOINTMENT_STATUS } = require("../constants");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.BOOKED,
    },
  },
  { timestamps: true }
);

appointmentSchema.index(
  { slot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: APPOINTMENT_STATUS.BOOKED },
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);