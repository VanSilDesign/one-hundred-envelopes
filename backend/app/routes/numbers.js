const express = require("express");
const router = express.Router();
const DbConnection = require("../config/db-connection");

router.get("/get-numbers", async (req, res) => {
  try {
    // Usiamo la proprietà statica che hai impostato in DbConnection
    const data = await DbConnection.numbersCollection
      .find({ active: { $ne: false } })
      .sort({ value: 1 }) // 1 = crescente, -1 = decrescente
      .toArray();
    const soloNumeri = data.map((doc) => doc.value);
    console.log(soloNumeri);

    res.json(soloNumeri);
  } catch (err) {
    res.status(500).send("Errore nel recupero dati: " + err.message);
  }
});

router.post("/save-number", async (req, res) => {
  const { number } = req.body;
  console.log("Body ricevuto:", req.body);

  // if (!req.isAuthenticated()) {
  //   return res.status(401).json({ message: "Devi essere loggato!" });
  // }

  if (number === undefined) {
    return res.status(400).json({ message: "Numero mancante!" });
  }

  const existing = await DbConnection.numbersCollection.findOne({
    value: number,
  });
  if (existing) {
    return res.status(400).json({ message: "Numero già estratto!" });
  }

  try {
    await DbConnection.numbersCollection.insertOne({
      value: number,
      createdAt: new Date(),
      active: true
    });
    res.status(200).json({ message: "Numero salvato con successo!" });
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
      {value: numeroDaEliminare},
      { $set: { active: false } }
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
      { active: { $ne: false } }, // Prendiamo solo quelli ancora attivi
      { $set: { active: false } }  // E li "spegniamo" tutti
    );

    res.status(200).json({ 
      message: "History archiviata con successo", 
      modifiedCount: result.modifiedCount 
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
    const result = await DbConnection.numbersCollection.deleteMany({});
    
    res.status(200).json({ 
      message: "History svuotata con successo", 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ error: "Errore durante il reset della history" });
  }
});

module.exports = router;
