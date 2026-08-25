const mongoose = require("mongoose");

const amountSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  active: { type: Boolean, required: true },
  isOpened: { type: Boolean, required: false },
  openedAt: { type: Date, default: null },
  note: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const challengeConfigSchema = new mongoose.Schema(
  {
    // IDENTITA' DELLA CHALLENGE
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeName: { type: String, default: "La mia sfida" },

    // LOGICA DELLA GRIGLIA
    generationType: {
      type: String,
      enum: ["manual", "range", "1-100"],
      default: "manual",
      version: { type: Number, default: 1 },
    },

    // PARAMETRI DI GENERAZIONE (Popolati solo se necessari)
    configParams: {
      step: { type: Number },
      maxValue: { type: Number },
      numberOfEnvelopes: { type: Number },
      startValue: { type: Number, default: 1 }, // Utile se vogliono fare 50-150
    },

    // IL RISULTATO FINALE
    amounts: [amountSchema],

    // LO STATO DELLA CHALLENGE
    isAvailable: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },

    //LO STILE DELLA CHALLENGE
    color: { type: String, default: "#D2691E" }, // Il colore della sfida per i grafici
    icon: { type: String, default: "envelope" },
    currency: { type: String, default: "€" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ChallengeConfig", challengeConfigSchema);
