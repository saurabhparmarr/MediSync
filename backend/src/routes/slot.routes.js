const express = require("express");
const slotController = require("../controllers/slot.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { ROLES } = require("../constants");
const { createSlotSchema } = require("../validators/slot.validator");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize(ROLES.DOCTOR),
  validate(createSlotSchema),
  slotController.createSlot
);

module.exports = router;