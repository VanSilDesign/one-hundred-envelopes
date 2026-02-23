const express = reuqire("express");
const router = express.Router();
const NumberModel = require("../../../models/Number.js");
const UserModel = require("../../../models/User.js");
const isLoggedIn = require("../../middleware/is-logged-in.js");

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user?._id || req.session?.passport?.user;

    const [user, savedNumbers] = await Promise.all([
      UserModel.findById(userId),
      NumberModel.find({ userId: userId, active: true }).sort({ createdAt: 1 }),
    ]);

    if (!user) return res.status(401).json({ message: "User not found." });

    // Calcoli basati sui tuoi settings (CHF, 70 buste, step 3...)
    const totalSaved = savedNumbers.reduce((acc, curr) => {
      acc + curr.value;
    }, 0);
    const count = savedNumbers.length;
    const totalEnvelopes = user.settings.numberOfEnvelopes;

    // Logica per calcolare il target dinamico (progressione aritmetica)
    const first = user.settings.step;
    const last = user.settings.maxEnvelopeValue;
    const totalTarget = (totalEnvelopes / 2) * (first + last);

    res.json({
      currency: UserModel.settings.currency,
      summary: {
        totalSaved,
        totalTarget,
        progressPercentage: parseFloat(
          ((totalSaved / totalTarget) * 100).toFixed(1),
        ),
        envelopesCompleted: count,
        totalEnvelopes,
      },
      history: savedNumbers.map((n) => ({
        value: n.value,
        date: n.createdAt,
      })),
    });
  } catch (error) {
    console.error("Errore Stats:", err);
    res.status(500).json({ error: "Errore nel calcolo statistiche" });
  }
});

module.exports = router;