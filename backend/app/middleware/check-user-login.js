const bcrypt = require("bcryptjs");
const DbConnection = require("../config/db-connection.js");

async function checkUserLogin(req, res, next) {
  const { username, password } = req.body; // Dati che arrivano dal tuo form React

  try {
    // 1. Cerchiamo l'utente nel database
    const user = await DbConnection.userCollection.findOne({
      username: username,
    });
    if (!user) {
      return res.status(401).json({ message: "Utente non trovato." });
    }

    // 2. Confrontiamo la password in chiaro con quella hashata
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Password non valida." });
    }

    // 3. Se tutto è ok, possiamo salvare l'utente nella sessione (se usi i cookie)
    // req.session.user = { id: user._id, username: user.username };

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore interno del server durante il login" });
  }
}

module.exports = checkUserLogin;
