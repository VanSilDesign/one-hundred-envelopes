const mongoose = require("mongoose");

const NumberSchema = new mongoose.Schema(
  {
    // Colleghiamo la busta all'utente (relazione 1-a-molti)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users", // Deve corrispondere al modello utenti in Mongo
    },
    value: {
      type: Number,
      required: true,
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
  // Questo aggiunge automaticamente 'createdAt' e 'updatedAt' (fondamentale per le Stats!)
);

module.exports = mongoose.model("number", NumberSchema);
