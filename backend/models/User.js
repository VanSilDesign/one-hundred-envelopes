const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const badgesSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  isUnlocked: { type: Boolean, required: false },
  unlockedAt: { type: Date, default: null },
  path: { type: String, default: "" },
  alt: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
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
    },
    googleID: {
      type: String,
      unique: true,
      sparse: true,
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
    badges: [badgesSchema],
    image: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Middleware automatico prima del salvataggio
userSchema.pre("save", async function () {
  // Se la password non è stata modificata (magari l'utente ha solo aggiornato i suoi badge),
  // saltiamo l'hashing, altrimenti computeremmo l'hash di un hash!
  if (!this.password || !this.isModified("password")) return; // 'this' si riferisce al documento dell'utente che sta per essere salvato

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    //console.log(error);
    throw error; // Lanciando l'errore, Mongoose blocca il salvataggio automaticamente
  }
});

// Il terzo parametro 'users' obbliga Mongoose a usare quel nome esatto nel DB
module.exports = mongoose.model("User", userSchema, "users");
