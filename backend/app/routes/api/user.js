const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const DbConnection = require("../../config/db-connection");
const mongoose = require("mongoose");

router.get("/get", async (req, res) => {
  const userId = req.user?._id || req.session?.passport?.user;

  if (!userId) {
    return res.status(401).json({ message: "Utente non autorizzato" });
  }
  try {
    const user = await DbConnection.userCollection.findOne({
      _id: new ObjectId(userId),
    });

    // console.log("Settings User caricato dal DB:", user.settings);

    return res.status(200).json(user.settings || {});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Errore interno al server",
    });
  }
});



module.exports = router;
