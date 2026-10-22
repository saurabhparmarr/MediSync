const rateLimit = require("express-rate-limit");
const ApiError = require("../utils/ApiError");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) =>
    next(new ApiError(429, "Too many failed attempts, please try again later")),
});

module.exports = { authLimiter };