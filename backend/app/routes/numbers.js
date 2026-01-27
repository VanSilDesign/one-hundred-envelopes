const express = require("express");
const router = express.Router();
const DbConnection = require("../config/db-connection");

router.get("/get-numbers", async (req, res) => {
  try {
    // Usiamo la proprietà statica che hai impostato in DbConnection
    const docs = await DbConnection.numbersCollection.find({}).toArray();
    const soloNumeri = docs.map((doc) => doc.valore);
    const html = `<div><h1>Dashboard</h1></div><div><h3>${soloNumeri}</div><div><a href="/logout">Logout</a></h3></div>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Errore nel recupero dati: " + err.message);
  }
});

module.exports = router;
