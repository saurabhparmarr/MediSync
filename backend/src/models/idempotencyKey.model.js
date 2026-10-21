const mongoose = require("mongoose");
const { IDEMPOTENCY_STATUS } = require("../constants");

const idempotencyKeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  key: { type: String, required: true, maxlength: 100 },
  requestHash: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(IDEMPOTENCY_STATUS),
    default: IDEMPOTENCY_STATUS.PROCESSING,
  },
  responseStatus: Number,
  responseBody: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});

idempotencyKeySchema.index({ user: 1, key: 1 }, { unique: true });

module.exports = mongoose.model("IdempotencyKey", idempotencyKeySchema);