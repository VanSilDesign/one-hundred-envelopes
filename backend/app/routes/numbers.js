const express = require("express");
const router = express.Router();
const DbConnection = require("../config/db-connection");
const { ObjectId } = require('mongodb');

router.get("/get-numbers", async (req, res) => {
  const userId = req.user?._id || req.session?.passport?.user;
  console.log("userId", userId);
  try {
    // Se non c'è utente, restituiamo un array vuoto invece di un errore 401
    if (!userId) {
      return res.json([]); 
    }

    const data = await DbConnection.numbersCollection
      .find({ userId: new ObjectId(userId), active: { $ne: false } })
      .sort({ value: 1 })
      .toArray();

    res.json(data.map(doc => doc.value));
  } catch (err) {
    res.status(500).json({ error: "Errore interno" });
  }
});

router.post("/save-number", async (req, res) => {
  console.log("Sessione attuale:", req.session);
  const userId = req.user?._id || req.session?.passport?.user;

  // 2. Controllo di sicurezza: req.session.user esiste?
  if (!userId) {
    return res.status(401).json({ 
      message: "Sessione non trovata o scaduta. Effettua di nuovo il login." 
    });
  }
  const { number } = req.body;
  console.log("Body ricevuto:", req.body);

  // if (!req.isAuthenticated()) {
  //   return res.status(401).json({ message: "Devi essere loggato!" });
  // }

  if (number === undefined) {
    return res.status(400).json({ message: "Numero mancante!" });
  }
  // Creiamo l'oggetto numero prima di inserirlo
  const numeroDaInserire = {
    value: number,
    userId: new ObjectId(userId), // Assicurati di aver importato ObjectId in alto
    createdAt: new Date(),
    active: true,
  };

  const existing = await DbConnection.numbersCollection.findOne({
    value: number,
    userId: new ObjectId(userId),
  });
  if (existing) {
    return res.status(400).json({ message: "Numero già estratto!" });
  }

  try {
    await DbConnection.numbersCollection.insertOne(numeroDaInserire);
    res.status(201).json({ message: "Numero salvato!", number: numeroDaInserire });
  } catch (error) {
    console.error("ERRORE NEL CATCH:", error.message);
    res.status(500).json({ message: "Errore durante il salvataggio." });
  }
});

router.patch("/soft-delete-number/:value", async (req, res) => {
  if (!req.params.value)
    return res.status(400).json({ message: "Numero mancante!" });

  try {
    const numeroDaEliminare = parseInt(req.params.value);
    const result = await DbConnection.numbersCollection.updateOne(
      { value: numeroDaEliminare, userId: req.user?._id || req.session?.passport?.user },
      { $set: { active: false } },
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Numero nascosto correttamente" });
    } else {
      res.status(404).json({ error: "Numero non trovato nel database" });
    }
  } catch (err) {
    res.status(500).json({ error: "Errore durante il soft-delete" });
  }
});

router.patch("/reset-all", async (req, res) => {
  try {
    const result = await DbConnection.numbersCollection.updateMany(
      { userId: req.user?._id || req.session?.passport?.user, active: { $ne: false } }, // Prendiamo solo quelli ancora attivi
      { $set: { active: false } }, // E li "spegniamo" tutti
    );

    res.status(200).json({
      message: "History archiviata con successo",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Errore durante il reset della history" });
  }
});

// Nel caso servisse l'eliminazione completa del numero o dei numeri

router.delete("/permanent-delete-number/:value", async (req, res) => {
  if (!req.params.value)
    return res.status(400).json({ message: "Numero mancante!" });

  try {
    const numeroDaEliminare = parseInt(req.params.value);
    const result = await DbConnection.numbersCollection.deleteOne({
      value: numeroDaEliminare,
      userId: req.user?._id || req.session?.passport?.user,
    });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Numero rimosso correttamente" });
    } else {
      res.status(404).json({ error: "Numero non trovato nel database" });
    }
  } catch (err) {
    res.status(500).json({ error: "Errore durante l'eliminazione" });
  }
});

router.delete("/permanet-reset-all", async (req, res) => {
  try {
    // deleteMany({}) senza filtri svuota l'intera collezione
    const result = await DbConnection.numbersCollection.deleteMany({
      userId: req.user?._id || req.session?.passport?.user,
    });

    res.status(200).json({
      message: "History svuotata con successo",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Errore durante il reset della history" });
  }
});

module.exports = router;
