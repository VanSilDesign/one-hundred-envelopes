require('dotenv').config();
const { EventEmitter } = require("events");
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');

class DbConnection extends EventEmitter {
  mongoClient = new MongoClient(process.env.DATABASE_URL_MONGO);

  async getConnection() {
    try {
      console.log("Connessione a MongoDB...");
      await this.mongoClient.connect();
      console.log("Connessione a Mongoose...");
      await mongoose.connect(process.env.DATABASE_URL_MONGO);

      const db = this.mongoClient.db("envelopes");

      DbConnection.db = db;
      DbConnection.userCollection = db.collection("users");
      DbConnection.numbersCollection = db.collection("numbers");

      console.log("Tutti i sistemi di database sono connessi! ✅");
      this.emit("dbConnection", { db });
    } catch (err) {
      console.error("Errore durante l'inizializzazione dei database: ❌", err);
    }
  }
}

module.exports = DbConnection;
