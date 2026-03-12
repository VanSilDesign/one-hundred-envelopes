const express = require("express");
const router = express.Router();
const ChallengeConfig = require("../../../models/ChallengeConfig"); // Assicurati che il percorso sia corretto

// 1. GET: Recupera solo i valori delle buste APERTE (per le statistiche)
router.get("/get-numbers", async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return res.json([]);

  try {
    const challenge = await ChallengeConfig.findOne({
      userId,
      isAvailable: true,
    });
    if (!challenge) return res.json([]);

    // Filtriamo solo quelle con isOpened: true
    const openedValues = challenge.amounts
      .filter((env) => env.isOpened)
      .map((env) => env.value);

    res.json(openedValues);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero numeri" });
  }
});

// 2. PATCH: "Salva" (Apri) una busta
router.patch("/save-number", async (req, res) => {
  const userId = req.user?._id;
  const { number } = req.body; // Il numero da "aprire"

  if (!userId) return res.status(401).json({ message: "Sessione scaduta" });
  if (number === undefined)
    return res.status(400).json({ message: "Numero mancante!" });

  try {
    const updatedChallenge = await ChallengeConfig.findOneAndUpdate(
      { userId, isAvailable: true, "amounts.value": number },
      {
        $set: { "amounts.$.isOpened": true, "amounts.$.openedAt": new Date() },
      },
      { returnDocument: "after" }, // <--- Al posto di { new: true } che sarà deprecato
    );

    if (!updatedChallenge) {
      return res.status(404).json({ message: "Sfida non trovata" });
    }

    // Invia una risposta pulita. Non inviare tutto 'updatedChallenge' 
    // se sospetti che l'oggetto sia troppo pesante o causi il 500.
    res.status(200).json({ 
      success: true, 
      message: "Busta aggiornata",
      number: number 
    });
  } catch (error) {
    res.status(500).json({ message: "Errore durante il salvataggio." });
  }
});

// 3. PATCH: Soft-Delete (Richiudi una busta specifica)
router.patch("/soft-delete-number/:value", async (req, res) => {
  const userId = req.user?._id;
  const number = parseInt(req.params.value);

  try {
    const updatedChallenge = await ChallengeConfig.findOneAndUpdate(
      { userId, isAvailable: true, "amounts.value": number },
      {
        $set: { "amounts.$.isOpened": false, "amounts.$.openedAt": new Date() },
      },
      { returnDocument: "after" }, // <--- Al posto di { new: true } che sarà deprecato
    );

    if (!updatedChallenge) {
      return res.status(404).json({ message: "Sfida non trovata" });
    }

    // Invia una risposta pulita. Non inviare tutto 'updatedChallenge'
    // se sospetti che l'oggetto sia troppo pesante o causi il 500.
    res.status(200).json({
      success: true,
      message: "Busta aggiornata",
      number: number,
    });
  } catch (err) {
    console.error("ERRORE 500 DETTAGLIATO:", err); // Leggi questo nel terminale!
    res.status(500).json({ error: err.message });
  }
});

// 4. PATCH: Reset All (Richiudi TUTTE le buste della sfida attuale)
router.patch("/reset-all", async (req, res) => {
  const userId = req.user?._id;

  try {
    // Usiamo $[ ] per aggiornare tutti gli elementi dell'array che corrispondono
    await ChallengeConfig.updateOne(
      { userId, isAvailable: true },
      { $set: { "amounts.$[].isOpened": false } },
    );

    res.status(200).json({ message: "Tutte le buste sono state richiuse." });
  } catch (err) {
    res.status(500).json({ error: "Errore durante il reset" });
  }
});

module.exports = router;
