const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { asyncHandler } = require("./error.middleware");
const { COOKIE_NAME } = require("../constants");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new ApiError(401, "Not authenticated");

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, "User no longer exists");

  req.user = user;
  next();
});

module.exports = { protect };