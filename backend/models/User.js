const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    settings: {
      numberOfEnvelopes: { type: Number, default: 100 },
      maxEnvelopeValue: { type: Number, default: 100 },
      step: { type: Number, default: 1 },
      currency: { type: String, default: "€" },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamp: true },
);

module.exports = mongoose.model("user", UserSchema);
