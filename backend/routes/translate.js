const express = require("express");
const translateText = require("../controllers/translate");

const router = express.Router();

router.post('/', translateText)

module.exports = router;