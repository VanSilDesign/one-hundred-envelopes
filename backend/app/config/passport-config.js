require("dotenv").config();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../models/User.js");

// 1. Strategia Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/google-auth-redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleID: profile.id });

        if (!user) {
          user = await User.create({
            googleID: profile.id,
            username:
              profile.displayName || profile.emails[0].value.split("@")[0],
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : null,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

// 2. Strategia Locale (Login Classico)
passport.use(
  "local-login",
  new LocalStrategy(
    { 
      usernameField: 'email', // Diciamo a Passport che usiamo 'email' invece di 'username'
      passwordField: 'password' 
    },
    async (email, password, done) => {
      try {
        // Mongoose findOne e chiediamo esplicitamente a Mongoose di includere la password nel risultato
        const user = await User.findOne({ email: email }).select("+password");
        
        if (!user) {
          return done(null, false, { message: "Utente non trovato." });
        }

        if (!user.password) {
          return done(null, false, { message: "Questo account utilizza l'autenticazione Google." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Password errata." });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// 3. Serializzazione (Salva l'ID nella sessione)
passport.serializeUser((user, done) => {
  done(null, user.id); // Con Mongoose puoi usare .id invece di ._id
});

// 4. Deserializzazione (Recupera l'utente dall'ID nella sessione)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); 
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;