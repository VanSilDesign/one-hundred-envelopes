const express = require("express");
const router = express.Router();
const ChallengeConfig = require("../../../models/ChallengeConfig");
const { calculateAndGenerateEnvelopes } = require("../../../utils/challengeHelpers");

// GET: Recupera la sfida attiva corrente
router.get("/get-current", async (req, res) => {
    const userId = req.user?._id || req.session?.passport?.user;

    try {
        // Cerchiamo l'ultima sfida disponibile
        const activeChallenge = await ChallengeConfig.findOne({ 
            userId, 
            isAvailable: true 
        }).sort({ createdAt: -1 });

        res.status(200).json(activeChallenge || {});
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero sfida" });
    }
});

// POST: Inizializza o Reset Sfida (Nuova funzione core)
router.post("/initialize", async (req, res) => {
    const userId = req.user?._id || req.session?.passport?.user;

    const { challengeName, maxEnvelopeValue, step, numberOfEnvelopes, currency, generationType } = req.body;

    try {
        // 1. Usiamo l'helper (quello con la logica di Gauss e il ciclo for)
        const { envelopes } = calculateAndGenerateEnvelopes(
            maxEnvelopeValue, 
            step, 
            numberOfEnvelopes
        );

        // 2. Gestione Premium: se non è premium, disattiviamo le altre
        // Qui potrai aggiungere il controllo: if (!req.user.isPremium) ...
        await ChallengeConfig.updateMany(
            { userId, isAvailable: true },
            { isAvailable: false }
        );

        // 3. Creazione nuova sfida con Mongoose
        const newChallenge = new ChallengeConfig({
            userId,
            challengeName: challengeName || "La mia sfida",
            generationType: generationType || 'range',
            configParams: { maxEnvelopeValue, step, numberOfEnvelopes },
            amounts: envelopes,
            currency: currency || "€",
            isAvailable: true,
            version: Date.now() // Un modo semplice per avere versioni uniche
        });

        await newChallenge.save();
        res.status(201).json({ success: true, data: newChallenge });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get("/active-challenge", async (req, res) => {
  const userId = req.user?._id || req.session?.passport?.user;
  try {
    const challenge = await ChallengeConfig.findOne({ 
      userId, 
      isAvailable: true 
    }).sort({ createdAt: -1 }); // Prende sempre l'ultima creata

    if (!challenge) {
      return res.status(404).json({ message: "Nessuna sfida attiva trovata" });
    }
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero della sfida" });
  }
});

module.exports = router;