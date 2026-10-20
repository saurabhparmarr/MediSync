const { z } = require("zod");
const { objectId } = require("./common.validator");

const createSlotSchema = z.object({
  body: z
    .object({
      startTime: z.coerce.date(),
      endTime: z.coerce.date(),
    })
    .refine((data) => data.endTime > data.startTime, {
      message: "End time must be after start time",
      path: ["endTime"],
    })
    .refine((data) => data.startTime > new Date(), {
      message: "Start time must be in the future",
      path: ["startTime"],
    }),
});

const listSlotsSchema = z.object({
  params: z.object({ doctorId: objectId }),
  query: z.object({ from: z.coerce.date().optional() }),
});

module.exports = { createSlotSchema, listSlotsSchema };