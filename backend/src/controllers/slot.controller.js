const slotService = require("../services/slot.service");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../middlewares/error.middleware");

const createSlot = asyncHandler(async (req, res) => {
  const slot = await slotService.createSlot({
    userId: req.user._id,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
  });
  res.status(201).json(new ApiResponse(201, { slot }, "Slot created"));
});

const listSlots = asyncHandler(async (req, res) => {
  const slots = await slotService.listAvailableSlots({
    doctorId: req.params.doctorId,
    from: req.query.from ? new Date(req.query.from) : undefined,
  });
  res.status(200).json(new ApiResponse(200, { slots }, "Available slots fetched"));
});

module.exports = { createSlot, listSlots };