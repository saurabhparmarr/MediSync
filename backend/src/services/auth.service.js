const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const { ROLES } = require("../constants");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password, role: ROLES.PATIENT });

  return { user: sanitizeUser(user), token: generateToken(user._id) };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  return { user: sanitizeUser(user), token: generateToken(user._id) };
};

module.exports = { sanitizeUser, registerUser, loginUser };