const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const multer = require("../middleware/multer-config")

const saucesCtrl = require("../controllers/sauces");



router.get("/", auth, saucesCtrl.sauces)
router.get("/:id", auth, saucesCtrl.sauce)
router.post("/", auth, multer, saucesCtrl.createSauces)
router.put("/:id", auth, multer, saucesCtrl.modifySauces)
router.delete("/:id", auth, saucesCtrl.suppSauces)
router.post("/:id/like", auth, saucesCtrl.likeSauces)
module.exports = router;  