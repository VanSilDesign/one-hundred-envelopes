const mongoose = require("mongoose");

const BadgesSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  isUnlocked: { type: Boolean, required: false },
  unlockedAt: { type: Date, default: null },
  path: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    badges: [BadgesSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamp: true },
);

// Il terzo parametro 'users' obbliga Mongoose a usare quel nome esatto nel DB
module.exports = mongoose.model("User", UserSchema, "users");
