const express = require("express");
const doctorController = require("../controllers/doctor.controller");
const slotController = require("../controllers/slot.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { ROLES } = require("../constants");
const {
  createDoctorSchema,
  listDoctorsSchema,
} = require("../validators/doctor.validator");
const { listSlotsSchema } = require("../validators/slot.validator");

const router = express.Router();

router.get("/", validate(listDoctorsSchema), doctorController.listDoctors);

router.get("/:doctorId/slots", validate(listSlotsSchema), slotController.listSlots);

router.post(
  "/",
  protect,
  authorize(ROLES.ADMIN),
  validate(createDoctorSchema),
  doctorController.createDoctor
);

module.exports = router;