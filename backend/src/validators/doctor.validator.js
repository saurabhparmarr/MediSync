const { z } = require("zod");
const { objectId } = require("./common.validator");

const createDoctorSchema = z.object({
  body: z.object({
    userId: objectId,
    specialization: z.string().trim().min(2).max(60),
    consultationFee: z.number().min(0),
    bio: z.string().trim().max(500).optional(),
  }),
});

const listDoctorsSchema = z.object({
  query: z.object({
    specialization: z.string().trim().min(1).optional(),
  }),
});

module.exports = { createDoctorSchema, listDoctorsSchema };