const express = require("express");
const router = express.Router();
const DbConnection = require("../config/db-connection");

router.get("/get-numbers", async (req, res) => {
  try {
    // Usiamo la proprietà statica che hai impostato in DbConnection
    const data = await DbConnection.numbersCollection
      .find({})
      .sort({ valore: 1 }) // 1 = crescente, -1 = decrescente
      .toArray();
    const soloNumeri = data.map((doc) => doc.valore);
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
    valore: number,
  });
  if (existing) {
    return res.status(400).json({ message: "Numero già estratto!" });
  }

  try {
    await DbConnection.numbersCollection.insertOne({
      valore: number,
      createdAt: new Date(),
    });
    res.status(200).json({ message: "Numero salvato con successo!" });
  } catch (error) {
    console.error("ERRORE NEL CATCH:", error.message);
    res.status(500).json({ message: "Errore durante il salvataggio." });
  }
});

router.get("/delete-number/:value", async (req, res) => {
  if (!req.params.value)
    return res.status(400).json({ message: "Numero mancante!" });

  try {
    const numeroDaEliminare = parseInt(req.params.value);
    const data = await DbConnection.numbersCollection.deleteOne({
      valore: numeroDaEliminare,
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

module.exports = router;
