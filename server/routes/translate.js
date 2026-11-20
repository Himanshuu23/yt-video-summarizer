const express = require("express");
const translateText = require("../controllers/translate");

const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post('/', requireAuth, translateText)

module.exports = router;
