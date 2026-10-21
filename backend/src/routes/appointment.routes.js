const express = require("express");
const appointmentController = require("../controllers/appointment.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { ROLES } = require("../constants");
const {
  bookAppointmentSchema,
  cancelAppointmentSchema,
} = require("../validators/appointment.validator");

const router = express.Router();

router.use(protect, authorize(ROLES.PATIENT));

router.post("/", validate(bookAppointmentSchema), appointmentController.bookAppointment);
router.get("/me", appointmentController.listMyAppointments);
router.delete("/:id", validate(cancelAppointmentSchema), appointmentController.cancelAppointment);

module.exports = router;