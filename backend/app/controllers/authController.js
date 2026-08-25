const crypto = require("crypto");
const User = require("../../models/User.js");
const ChallengeConfig = require("../../models/ChallengeConfig.js");
const transporter = require("../config/mailer.js");
const bcrypt = require("bcryptjs");
const { unlockBadge } = require("../../utils/badgeManager.js");
const { log } = require("console");

//Funzione di cancellazione token appena usato
exports.clearVerificationToken = async (req, res) => {
  try {
    const { token } = req.params;
    const cleanToken = token ? token.trim() : "";
    console.log("token da clearVerificationToken:", cleanToken);

    if (cleanToken) {
      await User.findOneAndUpdate(
        { verificationToken: cleanToken },
        { $unset: { verificationToken: "" } },
      );
      console.log("Token eliminato");
    }

    return res.status(200).json({ message: "Token eliminato con successo." });
  } catch (error) {
    console.log("Non è stato possibile rimuovere il token");
    return res
      .status(200)
      .json({ message: "Token non rimosso ma procedi pure" });
  }
};

// Funzione di invio verifica email
exports.sendVerificationEmail = async (req, res) => {
  console.log("sendVerificationEmail");
  try {
    const user = await User.findById(
      req.user?.id || req.session?.passport?.user,
    );

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato." });
    }

    const { email, username } = user;

    if (user.isVerified) {
      return res.status(400).json({ message: "Sei già verificato!" });
    }

    // Salviamo il token nell'utente (se il token esiste riutilizziamo quello)
    let token = user.verificationToken;
    console.log(token);

    if (!token) {
      token = crypto.randomBytes(32).toString("hex");
      user.verificationToken = token;
      await user.save();
    }

    const verificationUrl = `http://localhost:5173/verify-email/${token}`;

    console.log("user mail", email);
    

    await transporter.sendMail({
      from: '"Saving App 🐷" <noreply@savingapp.com>',
      to: email,
      subject: "Conferma la tua email",
      html: `<div style="padding: 24px 0">
              <h1>Ciao ${username}!</h1>
              <p>Guadagna il tuo primo badge.</p>
              <p>Per attivare il tuo account e ricevere il tuo primo badge, clicca qui:</p>
              <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #f4c49f; color: #4a4a4a; text-decoration: none; border-radius: 4px;">Verifica Account</a>
            </div>`,
    });

    console.log("Email inviata a:", email, "Link:", verificationUrl);

    res
      .status(200)
      .json({ message: "Email di verifica inviata con successo!" });
  } catch (error) {
    console.log("sendVerificationEmail error", error);
    res.status(500).json({
      message: "Errore durante l'invio dell'email.",
    });
  }
};

// Funzione verifica la mail dell'utente
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const cleanToken = token ? token.trim() : "";

    // 1. Cerca l'utente con il token
    let user = await User.findOne({ verificationToken: cleanToken });

    // 2. SE NON TROVA L'UTENTE:
    if (!user) {
      console.log("Nessun utente trovato con un verificationToken nel DB!");
      const userId = req.user?.id || req.session?.passport?.user;
      if (userId) {
        const existingUser = await User.findById(userId);
        if (existingUser && existingUser.isVerified) {
          return res.status(200).json({
            message: "Email già verificata con successo!",
            user: existingUser,
          });
        }
      }

      return res
        .status(400)
        .json({ message: "Token non valido o già utilizzato." });
    }

    // 3. Aggiorna il badge in modo Mongoose-safe
    if (user.badges && user.badges.length > 0) {
      const badge = user.badges.find((b) => b.id === 1);
      if (badge && !badge.isUnlocked) {
        badge.isUnlocked = true;
        badge.unlockedAt = new Date();
      }
    }

    user.isVerified = true;
    // user.verificationToken = undefined; // Lo tolgo da qui perché altrimenti NON VA

    // 4. Salva tutto in un colpo solo (Verifica + Badge)
    await user.save();

    req.login(user, (err) => {
      if (err) {
        console.error("Errore nell'auto-login:", err);
        return res
          .status(500)
          .json({ message: "Errore durante l'accesso automatico." });
      }

      // Salvataggio esplicito per evitare race condition prima della risposta
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("Errore salvataggio sessione:", saveErr);
          return res
            .status(500)
            .json({ message: "Errore nel salvataggio della sessione." });
        }

        console.log("Loggato con successo");
        res.status(200).json({
          message: "Email verificata! Badge 'Account Verificato' sbloccato! 🏆",
          user: user,
        });
      });
    });
  } catch (error) {
    console.error("Errore verifica email:", error);
    res.status(500).json({ message: "Errore nella verifica." });
  }
};

// Funzione per RICHIEDERE il reset (Invia la mail)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  //console.log(email);

  try {
    // 1. Cerca l'utente
    const user = await User.findOne({ email: email });
    //console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email non trovata. L'utente non è registrato." });
    }

    //2. Genera token segreto "usa e getta"
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Salva la versione criptata del token nel DB (per sicurezza) e la scadenza (1 ora)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 3600000; // 1 ora
    await user.save();

    // 4. Crea l'URL che l'utente cliccherà nella mail
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // 5. Contenuto della mail
    const mailOptions = {
      from: '"Saving App" <noreply@savinapp.com',
      to: user.email,
      subject: "Recupero Password",
      html: `<div style="padding: 24px 0"><h1>Hai richiesto il reset della password?</h1>
              <p>Clicca sul link qui sotto per procedere. Il link scadrà tra un'ora.</p>
              <a href="${resetUrl}" style="padding: 10px 20px; background-color: #f4c49f; color: #4a4a4a; text-decoration: none; border-radius: 4px;">
                  Resetta la mia password
              </a>
            </div>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email di recupero inviata!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errore nell'invio della mail. Riprova più tardi." });
  }
};

// Funzione per EFFETTUARE il reset (Salva la nuova password)
exports.resetPassword = async (req, res) => {
  try {
    // 1. Criptiamo il token ricevuto per confrontarlo con quello nel DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Controlla che non sia scaduto
    });

    if (!user) {
      return res.status(400).json({ message: "Token non valido o scaduto" });
    }

    // ATTENZIONE!!!! Avendo inserito nello Schema di User.js il userSchema.pre('save') non ho più bisogno di criptare la password qui,
    // ma lo faccio direttamente pre-salvataggio

    /* // 2. Usiamo BCRYPT per la nuova password scelta dall'utente
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt); */

    // 3. Puliamo i campi del token così non può più essere riutilizzato
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.password = req.body.password;
    await user.save();

    res.status(200).json({ message: "Password aggiornata con successo." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante il reset della password." });
  }
};

// Funzione di registrazione
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Verifica se esiste già
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "Email o Username esistenti." });
    }

    // ATTENZIONE!!!! Avendo inserito nello Schema di User.js il userSchema.pre('save') non ho più bisogno di criptare la password qui,
    // ma lo faccio direttamente pre-salvataggio

    // 2. Hash Password e creazione Token di verifica
    //const hashedPassword = await bcrypt.hash(password, 12);
    const vToken = crypto.randomBytes(32).toString("hex");
    console.log("vToken", vToken);

    // 3. Crea la serie di badges da completare
    const defaultBadges = [
      {
        id: 1,
        name: "verified-account",
        active: true,
        isUnlocked: false,
        unlockedAt: null,
        path: "/public/badges/verified-account.svg",
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "first-number",
        active: true,
        isUnlocked: false,
        unlockedAt: null,
        path: "/public/badges/first-number.svg",
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "pro-saver",
        active: true,
        isUnlocked: false,
        unlockedAt: null,
        path: "/public/badges/pro-saver.svg",
        createdAt: new Date(),
      },
    ];

    // 4. Salva l'utente (non ancora verificato) e la challenge standard
    const newUser = new User({
      username,
      email,
      password,
      verificationToken: vToken,
      isVerified: false,
      badges: defaultBadges,
    });

    await newUser.save();

    // --- LOGICA DI GENERAZIONE 1-100 ---
    const defaultEnvelopes = [];
    for (let i = 1; i <= 100; i++) {
      defaultEnvelopes.push({
        value: i, // Busta 1 = 1€, Busta 2 = 2€...
        active: true, // Disponibile per essere cliccata
        isOpened: false,
        note: "",
      });
    }

    const firstChallenge = new ChallengeConfig({
      userId: newUser._id,
      name: "La mia prima sfida 🐷",
      generationType: "1-100",
      configParams: {
        step: 1,
        maxValue: 100,
        numberOfEnvelopes: 100,
        startValue: 1,
      },
      amounts: defaultEnvelopes,
      isAvailable: true,
      isCompleted: false,
    });

    await firstChallenge.save();

    // 4. Invia la Mail di Benvenuto/Verifica
    const verifyUrl = `http://localhost:5173/verify-email/${vToken}`;

    await transporter.sendMail({
      from: '"Saving App 🐷" <noreply@savingapp.com>',
      to: email,
      subject: "Benvenuto! Conferma la tua email",
      html: `<div style="padding: 24px 0">
              <h1>Ciao ${username}!</h1>
              <p>Grazie per esserti unito alla sfida del risparmio.</p>
              <p>Per attivare il tuo account e ricevere il tuo primo badge, clicca qui:</p>
              <a href="${verifyUrl}" style="padding: 10px 20px; background-color: #f4c49f; color: #4a4a4a; text-decoration: none; border-radius: 4px;">Verifica Account</a>
            </div>`,
    });

    res.status(201).json({
      message:
        "Registrazione completata e sfida creata! Controlla la mail per verificare l'account.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Errore durante la registrazione." });
  }
};
