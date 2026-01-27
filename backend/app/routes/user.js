const express = require("express");
const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.user });
});

router.get("/dashboard-2", (req, res) => {
  const html = `<div><h1>Dashboard</h1></div><div><h3>Ciao ${req.user.username}</div><div><a href="/logout">Logout</a></h3></div>`;
  res.send(html);
});

module.exports = router;
