const express = require("express");

const router = express.Router();

const userCtrl = require("../controllers/user");

// Mettre auth avant les gestionnaire de route pour effectuer une authentification : ("/signup", auth, userCtrl.signup)
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;  