const express = require("express");
const router = express.Router();
const isLoggedIn = require('../../middleware/is-logged-in.js');
const userController = require('../../controllers/userController.js');

// 1. Rotte PUBBLICHE (se ne avrai) vanno qui sopra
// router.get('/leaderboard', userController.getPublicStats);

// 2. Applichi il middleware a TUTTO quello che segue
router.use(isLoggedIn);

// 3. Da qui in poi, tutte le rotte sono automaticamente protette
router.get('/me', userController.getMe);

// 4. Carica autonomamente la lista dei badges
router.get('/my-badges', userController.getMyBadges);

router.put("/update-password", userController.updatePassword);

module.exports = router;
