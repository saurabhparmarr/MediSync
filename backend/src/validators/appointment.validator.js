const { z } = require("zod");
const { objectId } = require("./common.validator");

const bookAppointmentSchema = z.object({
  body: z.object({
    slotId: objectId,
  }),
});

const cancelAppointmentSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

module.exports = { bookAppointmentSchema, cancelAppointmentSchema };