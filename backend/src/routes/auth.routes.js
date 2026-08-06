const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/auth.controller");

const {
  validateRegister,
  validateLogin,
} = require("../validators/auth.validator");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Register
router.post("/register", validateRegister, registerUser);

// Login
router.post("/login", validateLogin, loginUser);

// Current User
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;