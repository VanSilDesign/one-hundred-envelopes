const crypto = require("crypto");
const User = require("../../models/User.js");
const transporter = require("../config/mailer.js");
const bcrypt = require("bcryptjs");

// Funzione per RICHIEDERE il reset (Invia la mail)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    // 1. Cerca l'utente
    const user = await User.findOne({ email: email });
    console.log(user);

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
      html: `<h1>Hai richiesto il reset della password?</h1>
      <p>Clicca sul link qui sotto per procedere. Il link scadrà tra un'ora.</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #D2691E; color: white; text-decoration: none; border-radius: 5px;">
          Resetta la mia password
        </a>`,
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
      resetPasswordExpires: { $gt: Date.now() } // Controlla che non sia scaduto
    });

    if (!user) {
      return res.status(400).json({ message: "Token non valido o scaduto" });
    }

    // 2. Usiamo BCRYPT per la nuova password scelta dall'utente
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    // 3. Puliamo i campi del token così non può più essere riutilizzato
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password aggiornata con successo." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante il reset della password." });
  }
};
