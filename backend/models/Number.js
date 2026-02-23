const mongoose = require("mongoose");

const NumberSchema = new mongoose.Schema(
  {
    // Colleghiamo la busta all'utente (relazione 1-a-molti)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Deve corrispondere al modello utenti in Mongo
    },
    value: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  // Questo aggiunge automaticamente 'createdAt' e 'updatedAt' (fondamentale per le Stats!)
);

module.exports = mongoose.model("number", NumberSchema);
