const mongoose = require("mongoose");

const savingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  configId: { type: mongoose.Schema.Types.ObjectId, ref: "ChallengeConfig" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SavingSchema", savingSchema);
