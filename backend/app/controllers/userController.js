const User = require("../../models/User.js");
const bcrypt = require("bcryptjs");

exports.getMe = async (req, res) => {
  const userId = req.user?._id || req.session?.passport?.user;
  try {
    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );

    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore nel recupero dell'utente.", error: error });
  }
};

exports.getMyBadges = async (req, res) => {
  const userId = req.user?._id || req.session?.passport?.user;

  if (!userId) {
    return res.status(401).json({ message: "Sessione non valida o scaduta." });
  }

  try {
    const user = await User.findById(userId).select("badges");
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato." });
    }
    res.status(200).json(user.badges);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore nel recupero badge.", error: error });
  }
};

exports.updatePassword = async (req, res) => {
  const userId = req.user?._id || req.session?.passport?.user;

  if (!userId) {
    return res.status(401).json({ message: "Sessione non valida o scaduta." });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Entrambi i campi sono obbligatori." });
  }

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato." });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "La password corrente non è corretta." });
    }
    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: "Password aggiornata con successo!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore nel cambio password.", error: error });
  }
};
