require('dotenv').config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const DB = require("./db-connection");
const { ObjectId } = require("mongodb");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/google-auth-redirect",
      // responseType: "code" di solito non serve qui, lo gestisce Passport
    },
    async (accessToken, refreshToken, profile, done) => {
      // Ho cambiato tokenID in profile per chiarezza
      try {
        // 1. Cerchiamo l'utente nel DB usando l'ID univoco di Google
        let user = await DB.userCollection.findOne({
          googleID: profile.id,
        });
        
        // 2. Se l'utente non esiste, lo creiamo
        if (!user) {
          const userObj = {
            googleID: profile.id,
            username: profile.emails[0].value.split('@')[0],
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : null,
          };
          
          const ris = await DB.userCollection.insertOne(userObj);

          // 3. FIX per le nuove versioni di MongoDB:
          // Invece di ris.ops[0], costruiamo l'oggetto user con l'ID appena generato
          user = {
            ...userObj,
            _id: ris.insertedId,
          };
        }

        // 4. Restituiamo l'utente a Passport
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      const user = await DB.userCollection.findOne({ username: username });
      if (!user || user.password !== password) {
        return done(null, false, {
          message: req.flash(
            "loginFallito",
            "I dati non sono corretti. Riprova."
          ),
        });
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Usa 'new ObjectId(id)'
    const user = await DB.userCollection.findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
