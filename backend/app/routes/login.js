const express = require("express");
const router = express.Router();
const passport = require("../config/passport-config");

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/user/dashboard");
  res.render("login", { message: req.flash("loginFallito") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("/user/dashboard");
  }
);

router.get(
  "/google-auth",
  passport.authenticate("google", {
    scope: ["openid", "email"],
  })
);

router.get(
  "/google-auth-redirect",
  passport.authenticate("google"),
  (req, res) => {
    console.log("Siamo in Google auth redirect", req.user);
    res.redirect('/user/dashboard');
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
