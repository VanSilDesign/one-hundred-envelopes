const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const DbConnection = require("../../config/db-connection");
const passport = require("../../config/passport-config");

router.post("/register-admin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Dati non validi o password troppo corta." });
  }

  try {
    const existingUser = await DbConnection.userCollection.findOne({
      username,
    });
    if (existingUser)
      return res.status(400).json({ message: "Utente già registrato." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      settings: {
        numberOfEnvelopes: 100,
        maxEnvelopeValue: 100,
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
  passport.authenticate("local-login", (err, user, info) => {
    // 1. Errore tecnico del server
    if (err) return next(err);
    console.log(err);

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
        user: { username: user.username, role: user.role },
      });
    });
  })(req, res, next);
});

router.get(
  "/google-auth",
  passport.authenticate("google", {
    scope: ["openid", "email"],
  }),
);

router.get(
  "/google-auth-redirect",
  passport.authenticate("google"),
  (req, res) => {
    console.log("Siamo in Google auth redirect", req.user);
    res.redirect("/user/dashboard");
  },
);

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Errore nel logout." });

      req.session.destroy();
      res.clearCookie("connect.sid");
      res.json({ message: "Logout effettuato" });
    }
    res.redirect("/login");
  });
});

module.exports = router;
