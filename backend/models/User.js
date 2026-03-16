const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
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
    createdAt: { type: Date, default: Date.now },
  },
  { timestamp: true },
);

// Il terzo parametro 'users' obbliga Mongoose a usare quel nome esatto nel DB
module.exports = mongoose.model("User", UserSchema, "users");
