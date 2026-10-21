const crypto = require("crypto");
const IdempotencyKey = require("../models/idempotencyKey.model");
const ApiError = require("../utils/ApiError");
const { IDEMPOTENCY_STATUS } = require("../constants");
const { asyncHandler } = require("./error.middleware");

const idempotency = asyncHandler(async (req, res, next) => {
  const key = req.get("Idempotency-Key");
  if (!key) throw new ApiError(400, "Idempotency-Key header is required");
  if (key.length > 100) throw new ApiError(400, "Idempotency-Key is too long");

  const requestHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(req.body))
    .digest("hex");

  let record;
  try {
    record = await IdempotencyKey.create({ user: req.user._id, key, requestHash });
  } catch (err) {
    if (err.code !== 11000) throw err;

    const existing = await IdempotencyKey.findOne({ user: req.user._id, key });
    if (!existing) throw new ApiError(409, "Please retry the request");

    if (existing.requestHash !== requestHash) {
      throw new ApiError(422, "Idempotency-Key was already used with a different request");
    }

    if (existing.status === IDEMPOTENCY_STATUS.COMPLETED) {
      res.set("Idempotent-Replayed", "true");
      return res.status(existing.responseStatus).json(existing.responseBody);
    }

    throw new ApiError(409, "A request with this Idempotency-Key is still in progress");
  }

  let capturedBody;
  const originalJson = res.json.bind(res);
  res.json = (payload) => {
    capturedBody = JSON.parse(JSON.stringify(payload));
    return originalJson(payload);
  };

  res.on("finish", async () => {
    try {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await IdempotencyKey.updateOne(
          { _id: record._id },
          {
            status: IDEMPOTENCY_STATUS.COMPLETED,
            responseStatus: res.statusCode,
            responseBody: capturedBody,
          }
        );
      } else {
        await IdempotencyKey.deleteOne({ _id: record._id });
      }
    } catch (e) {
      console.error("Idempotency finalize failed:", e.message);
    }
  });

  next();
});

module.exports = { idempotency };