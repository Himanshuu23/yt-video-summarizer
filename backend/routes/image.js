const { generateImage } = require("../controllers/image");
const express = require("express");

const router = express.Router();

router.post("/", generateImage);

module.exports = router;