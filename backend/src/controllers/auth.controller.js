const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const cookieOptions = require("../utils/cookieOptions");
const { asyncHandler } = require("../middlewares/error.middleware");
const { COOKIE_NAME } = require("../constants");

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);

  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.status(201).json(new ApiResponse(201, { user }, "Registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);

  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.status(200).json(new ApiResponse(200, { user }, "Logged in successfully"));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

const getMe = asyncHandler(async (req, res) => {
  const user = authService.sanitizeUser(req.user);
  res.status(200).json(new ApiResponse(200, { user }, "Current user"));
});

module.exports = { register, login, logout, getMe };