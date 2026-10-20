const mongoose = require("mongoose");
const env = require("../src/config/env");
const User = require("../src/models/user.model");
const { ROLES } = require("../src/constants");

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/create-admin.js <email>");
  process.exit(1);
}

(async () => {
  await mongoose.connect(env.mongoUri);
  const result = await User.updateOne(
    { email: email.toLowerCase() },
    { role: ROLES.ADMIN }
  );
  console.log(result.matchedCount ? `${email} is now admin` : "User not found");
  await mongoose.disconnect();
})();