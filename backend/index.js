const express = require("express");
const session = require("express-session");
const passport = require("passport");
const DbConnection = require("./app/config/db-connection");
const checkUserLogin = require("./app/middleware/check-user-login");
const flash = require("connect-flash");

const app = express();
const port = process.env.PORT || 3000;
const conn = new DbConnection();

/* Routers */
const loginRouter = require("./app/routes/login");
const userRouter = require("./app/routes/user");
const numberRouter = require("./app/routes/numbers");

conn.on("dbConnection", (conn) => {
  app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
  });
});
conn.getConnection();

app.set("views", "app/views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "chiaveSegreta123",
    saveUninitialized: false,
    resave: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(loginRouter);
app.use("/user", checkUserLogin(), userRouter);
app.use("/numbers", numberRouter);
