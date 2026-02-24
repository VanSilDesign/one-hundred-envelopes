const express = require("express");
const router = express.Router();
const NumberModel = require("../../../models/Number.js");
const UserModel = require("../../../models/User.js");
const isLoggedIn = require("../../middleware/is-logged-in.js");

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const userIdString = req.user?._id.toString() || req.session?.passport?.user.toString();
    console.log("ID utente da cercare:", userIdString);

    const [user, savedNumbers] = await Promise.all([
      UserModel.findById(userIdString),
      NumberModel.find({ userId: userIdString, active: true }).sort({ createdAt: 1 }),
    ]);
    console.log("Utente trovato: ", user);

    if (!user) return res.status(401).json({ message: "User not found." });

    // Calcoli basati sui tuoi settings (CHF, 70 buste, step 3...)
    const totalSaved = savedNumbers.reduce((acc, curr) => acc + curr.value, 0);
    const count = savedNumbers.length;
    const totalEnvelopes = user.settings.numberOfEnvelopes;

    // Logica per calcolare il target dinamico (progressione aritmetica)
    const first = user.settings.step;
    const last = user.settings.maxEnvelopeValue;
    const totalTarget = (totalEnvelopes / 2) * (first + last);

    console.log(`--- STATS DEBUG ---`);
    console.log(`Utente: ${user.username}`);
    console.log(`Buste completate: ${count}/${totalEnvelopes}`);
    console.log(`Target calcolato: ${totalTarget} ${user.settings.currency}`);
    console.log(`Risparmiato: ${totalSaved}`);
    console.log(`-------------------`);

    res.json({
      currency: user.settings.currency, // 'user' (minuscolo, l'oggetto), non 'UserModel'
      summary: {
        totalSaved,
        totalTarget,
        progressPercentage: parseFloat(((totalSaved / totalTarget) * 100).toFixed(1)),
        envelopesCompleted: count,
        totalEnvelopes,
      },
      history: savedNumbers.map((n) => ({
        value: n.value,
        date: n.createdAt,
      })),
    });
  } catch (error) {
    console.error("Errore Stats:", error);
    res.status(500).json({ error: "Errore nel calcolo statistiche" });
  }
});

module.exports = router;
