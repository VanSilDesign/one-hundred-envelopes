const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const DbConnection = require("../../config/db-connection");
const passport = require("../../config/passport-config");
const authController = require("../../controllers/authController.js"); //così richiamo il modulo
const isLoggedIn = require("../../middleware/is-logged-in.js");
//const { forgotPassword } = require("../../controllers/authController.js"); //così richiamo la funzione, in questo caso sotto "authController."" non ci va

router.post("/register-admin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Dati non validi o password troppo corta." });
  }

  try {
    const existingUser = await DbConnection.userCollection.findOne({
      email,
    });
    if (existingUser)
      return res.status(400).json({ message: "Utente già registrato." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      settings: {
        numberOfEnvelopes: 100,
        maxValue: 100,
        step: 1,
        currency: "€",
        updatedAt: new Date(),
      },
    };

    await DbConnection.userCollection.insertOne(newUser);
    res.status(201).json({ message: "Admin creato con successo!" });
  } catch (error) {
    res.status(500).json({ message: "Errore durante la registrazione." });
  }
});

router.get("/status", (req, res) => {
  try {
    // Verifichiamo se Passport ha autenticato la sessione
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.status(200).json({
        isAuthenticated: true,
        user: req.user,
      });
    } else {
      return res.status(200).json({
        isAuthenticated: false,
        message: "Nessuna sessione attiva",
      });
    }
  } catch (error) {
    console.error("Errore nel server sulla rotta /status:", error);
    return res.status(500).json({
      error: "Errore interno del server",
      details: error.message,
    });
  }
});

router.post("/login", (req, res, next) => {
  console.log("Sono passata dal login");
  

  const token = req.params;
  console.log("Token preso da verifyEmail", token);
  
  passport.authenticate("local-login", (err, user, info) => {
    // 1. Errore tecnico del server
    if (err) return next(err);

    // 2. Credenziali sbagliate (user non trovato o password errata)
    if (!user) {
      return res.status(401).json({
        message: info ? info.message : "Credenziali non valide",
      });
    }

    // 3. Login riuscito: creiamo la sessione
    req.logIn(user, (err) => {
      if (err) return next(err);

      // Risposta JSON per React
      return res.json({
        message: "Login effettuato con successo!",
        user: { email: user.email, role: user.role },
      });
    });
  })(req, res, next);
});

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

router.post("/register", authController.register);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/send-verification", authController.sendVerificationEmail);
router.post("/clear-verification-token/:token", authController.clearVerificationToken);

// Rotta che fa partire il login con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Rotta di callback dopo che Google ha autenticato l'utente
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login?error=true",
  }),
  (req, res) => {
    // Login riuscito, reindirizziamo al frontend (magari con un token o semplicemente alla home)
    res.redirect("http://localhost:5173/");
  },
);

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Errore nel logout." });
    }

    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Errore nella distruzione della sessione." });
      }
    });

    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout effettuato con successo." });
  });
});

module.exports = router;
