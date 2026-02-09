const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const DbConnection = require("../config/db-connection");
const passport = require("../config/passport-config");

router.post("/register-admin", async (req, res) => {
  const { username, password } = req.body;

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
    };

    await DbConnection.userCollection.insertOne(newUser);
    res.status(201).json({ message: "Admin creato con successo!" });
  } catch (error) {
    res.status(500).json({ error: "Errore durante la registrazione." });
  }
});

// router.get("/login", (req, res) => {
//   if (req.isAuthenticated()) return res.redirect("/user/dashboard");
//   res.render("login", { message: req.flash("loginFallito") });
// });

router.post("/login", (req, res, next) => {
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

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
