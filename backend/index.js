const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./app/config/passport-config");
const DbConnection = require("./app/config/db-connection");
const isLoggedIn = require("./app/middleware/is-logged-in");
const flash = require("connect-flash");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // URL del tuo frontend React (Vite default)
    credentials: true, // Necessario se userai i cookie di Passport/Session
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Specifichiamo i metodi per sicurezza
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// --- MIDDLEWARE DI BASE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- SESSIONE E PASSPORT (Prima delle rotte!) ---
app.use(
  session({
    secret: "chiaveSegreta123",
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false, // Metti true solo se usi HTTPS
      sameSite: "lax",
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* Routers */
const authRouter = require("./app/routes/api/auth");
const userRouter = require("./app/routes/api/user");
const numberRouter = require("./app/routes/api/numbers");
const challengeRouter = require("./app/routes/api/challenge");
const statsRouter = require("./app/routes/api/stats");

// --- ROTTE ---
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/numbers", numberRouter);
app.use("/api/challenge", challengeRouter);
app.use("/api/stats", statsRouter);

// --- VISTE E CONNESSIONE ---
// app.set("views", "app/views");
// app.set("view engine", "ejs");

// --- ACCESSO AL DB ---
const conn = new DbConnection();
conn.on("dbConnection", (conn) => {
  app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
  });
});
conn.getConnection();
