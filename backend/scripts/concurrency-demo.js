const mongoose = require("mongoose");
const env = require("../src/config/env");
const User = require("../src/models/user.model");
const Doctor = require("../src/models/doctor.model");
const Slot = require("../src/models/slot.model");
const Appointment = require("../src/models/appointment.model");
const IdempotencyKey = require("../src/models/idempotencyKey.model");
const generateToken = require("../src/utils/generateToken");
const { COOKIE_NAME } = require("../src/constants");

const N = Number(process.argv[2]) || 100;
const BASE = process.env.BASE_URL || `http://localhost:${env.port}`;

(async () => {
  await mongoose.connect(env.mongoUri);
  let slot;
  let users = [];

  try {
    const doctor = await Doctor.findOne();
    if (!doctor) throw new Error("Koi doctor nahi mila, pehle doctor banao");

    const offsetMinutes = 30 * 24 * 60 + Math.floor(Math.random() * 100000);
    const start = new Date(Date.now() + offsetMinutes * 60000);
    slot = await Slot.create({
      doctor: doctor._id,
      startTime: start,
      endTime: new Date(start.getTime() + 30 * 60000),
    });

    users = await User.insertMany(
      Array.from({ length: N }, (_, i) => ({
        name: `LoadTest ${i}`,
        email: `loadtest${i}-${Date.now()}@t.com`,
        password: "loadtest-not-used",
      }))
    );

    console.log(`${N} patients ek hi slot ke liye ek saath request bhej rahe hain...`);
    const startedAt = Date.now();

    const statuses = await Promise.all(
      users.map(async (user, i) => {
        try {
          const res = await fetch(`${BASE}/api/appointments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `${COOKIE_NAME}=${generateToken(user._id)}`,
              "Idempotency-Key": `load-${slot._id}-${i}`,
            },
            body: JSON.stringify({ slotId: slot._id.toString() }),
          });
          return res.status;
        } catch {
          return "network-error";
        }
      })
    );

    const elapsed = Date.now() - startedAt;

    const tally = statuses.reduce((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const bookedCount = await Appointment.countDocuments({
      slot: slot._id,
      status: "booked",
    });
    const finalSlot = await Slot.findById(slot._id);

    console.log("\n--- RESULT ---");
    console.log("Time:", elapsed, "ms");
    console.log("Responses:", tally);
    console.log("DB mein booked appointments (is slot ki):", bookedCount);
    console.log("Slot ka final status:", finalSlot.status);
    console.log(
      bookedCount === 1 && tally[201] === 1
        ? "PASS: exactly 1 booking, 0 double booking"
        : "FAIL: kuch gadbad hai"
    );
  } catch (err) {
    console.error("Script error:", err.message);
  } finally {
    if (slot) {
      await Appointment.deleteMany({ slot: slot._id });
      await Slot.deleteOne({ _id: slot._id });
    }
    if (users.length) {
      const ids = users.map((u) => u._id);
      await IdempotencyKey.deleteMany({ user: { $in: ids } });
      await User.deleteMany({ _id: { $in: ids } });
    }
    await mongoose.disconnect();
  }
})();