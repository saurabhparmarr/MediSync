const ApiError = require("../utils/ApiError");
const env = require("../config/env");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
  }

  if (statusCode >= 500) {
    console.error(err);
    if (env.nodeEnv === "production") message = "Internal Server Error";
  }
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(err.details && { details: err.details }),
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};

module.exports = { asyncHandler, notFound, errorHandler };
