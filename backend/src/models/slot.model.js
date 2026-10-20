const mongoose = require("mongoose");
const { SLOT_STATUS } = require("../constants");

const slotSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
      validate: {
        validator: function (value) {
          return value > this.startTime;
        },
        message: "End time must be after start time",
      },
    },
    status: {
      type: String,
      enum: Object.values(SLOT_STATUS),
      default: SLOT_STATUS.AVAILABLE,
    },
  },
  { timestamps: true }
);

slotSchema.index({ doctor: 1, startTime: 1 }, { unique: true });
slotSchema.index({ doctor: 1, status: 1, startTime: 1 });

module.exports = mongoose.model("Slot", slotSchema);