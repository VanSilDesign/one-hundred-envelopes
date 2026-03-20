const express = require("express");
const router = express.Router();
const ChallengeConfigModel = require("../../../models/ChallengeConfig.js");
const isLoggedIn = require("../../middleware/is-logged-in.js");

router.get("/get-current", isLoggedIn, async (req, res) => {
  const userId = req.user?._id; // Grazie al middleware isLoggedIn, req.user dovrebbe essere popolato

  try {
    const activeChallenge = await ChallengeConfigModel.findOne({
      userId,
      isAvailable: true,
    }).sort({ createdAt: -1 });

    // 1. Controllo di sicurezza: Se non c'è una sfida, non crashare
    if (!activeChallenge) {
      return res.status(404).json({ message: "Nessuna sfida attiva trovata." });
    }

    // 2. Calcoli (Identici ai tuoi, puliti!)
    const openedEnvelopes = activeChallenge.amounts.filter(
      (env) => env.isOpened,
    );
    const totalSaved = openedEnvelopes.reduce(
      (acc, curr) => acc + curr.value,
      0,
    );
    const count = openedEnvelopes.length;
    const totalEnvelopes = activeChallenge.configParams.numberOfEnvelopes;

    const first = activeChallenge.configParams.step;
    const last = activeChallenge.configParams.maxValue;
    const totalTarget = (totalEnvelopes / 2) * (first + last);

    // 3. Risposta differenziata
    const responseData = {
      summary: {
        totalSaved,
        totalTarget,
        progressPercentage: parseFloat(
          ((totalSaved / totalTarget) * 100).toFixed(1),
        ),
        envelopesCompleted: count,
        totalEnvelopes,
      },
      // Restituiamo la history solo se l'utente è Premium
      history: req.user.isPremium
        ? activeChallenge.amounts
            .filter((n) => n.isOpened) // Magari solo quelle aperte?
            .sort(
              (a, b) =>
                new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime(),
            ) // Ordine CRONOLOGICO (dal più vecchio al più recente)
            .map((n) => ({ value: n.value, date: n.openedAt })) // Meglio updatedAt per la data di apertura
        : [],
      config: {
        currency: activeChallenge.currency,
        icon: activeChallenge.icon,
        color: activeChallenge.color
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error("Errore statistiche:", error);
    res.status(500).json({ message: "Errore nel recupero sfida" });
  }
});

module.exports = router;
