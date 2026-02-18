const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const DbConnection = require("../../config/db-connection");

router.get("/get", async (req, res) => {
  console.log("Siamo in settings/get");

  const userId = req.user?._id || req.session?.passport?.user;
  console.log(userId);

  if (!userId) {
    return res.status(401).json({ message: "Utente non autorizzato" });
  }
  try {
    const user = await DbConnection.userCollection.findOne({
      _id: new ObjectId(userId),
    });

    console.log("Settings User caricato dal DB:", user.settings);

    return res.status(200).json(user.settings || {});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Errore interno al server",
    });
  }
});

router.post("/save", async (req, res) => {
  const userId = req.user?._id || req.session?.passport?.user;

  if (!userId) {
    return res.status(401).json({ message: "Utente non autorizzato" });
  }

  const { numberOfEnvelopes, maxEnvelopeValue, step, currency } = req.body;

  try {
    const settingsUpdate = {
      "settings.numberOfEnvelopes": parseInt(numberOfEnvelopes),
      "settings.maxEnvelopeValue": parseInt(maxEnvelopeValue),
      "settings.step": parseInt(step),
      "settings.currency": currency || "€",
      "settings.updatedAt": new Date(), // Meglio dentro settings
    };

    const result = await DbConnection.userCollection.updateOne(
      { _id: new ObjectId(userId) }, // Cerchiamo per _id (quello vero del documento)
      { $set: settingsUpdate }, // Usiamo la dot notation per aggiornare solo l'oggetto settings
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato" });
    }

    return res.status(200).json({
      success: true,
      message: "Impostazioni salvate correttamente!",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Errore interno al server",
    });
  }
});

module.exports = router;
