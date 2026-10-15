const ROLES = Object.freeze({
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
});

const SLOT_STATUS = Object.freeze({
  AVAILABLE: "available",
  BOOKED: "booked",
});

const APPOINTMENT_STATUS = Object.freeze({
  BOOKED: "booked",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
});

const COOKIE_NAME = "token";

module.exports = { ROLES, SLOT_STATUS, APPOINTMENT_STATUS, COOKIE_NAME };