require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

async function createAdmin() {
try {
const name = process.env.ADMIN_NAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;


if (!name || !email || !password) {
  throw new Error(
    "Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in your backend .env file."
  );
}

if (password.length < 12) {
  throw new Error(
    "The admin password must contain at least 12 characters."
  );
}

await connectDB();

const existingAdmin = await Admin.findOne({ email });

if (existingAdmin) {
  console.log(
    "An administrator with this email already exists. No changes were made."
  );
  return;
}

const hashedPassword = await bcrypt.hash(password, 12);

await Admin.create({
  name,
  email,
  password: hashedPassword,
  role: "admin",
  isActive: true,
});

console.log("Admin account created successfully.");
console.log(`Admin email: ${email}`);
console.log("Your password was stored as a secure hash.");


} catch (error) {
console.error("Admin account creation failed:", error.message);
process.exitCode = 1;
} finally {
if (mongoose.connection.readyState !== 0) {
await mongoose.disconnect();
}
}
}

createAdmin();
