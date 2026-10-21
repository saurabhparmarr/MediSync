const express = require("express");
const authRoutes = require("./auth.routes");
const doctorRoutes = require("./doctor.routes");
const slotRoutes = require("./slot.routes");
const appointmentRoutes = require("./appointment.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/doctors", doctorRoutes);
router.use("/slots", slotRoutes);
router.use("/appointments", appointmentRoutes);

module.exports = router;