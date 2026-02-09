require('dotenv').config();
const { EventEmitter } = require("events");
const { MongoClient } = require("mongodb");

class DbConnection extends EventEmitter {
  mongoClient = new MongoClient(process.env.DATABASE_URL_MONGO);

  async getConnection() {
    try {
      console.log("Connessione a MongoDB...");
      await this.mongoClient.connect();

      const db = this.mongoClient.db("envelopes");

      DbConnection.db = db;
      DbConnection.userCollection = db.collection("users");
      DbConnection.numbersCollection = db.collection("numbers");

      console.log("MongoDB connesso");
      this.emit("dbConnection", { db });
    } catch (err) {
      console.error("Errore connessione MongoDB:", err);
    }
  }
}

module.exports = DbConnection;
