const express = require("express");
const { generateQuestions } = require("../controllers/questions");

const router = express.Router();

router.post('/', generateQuestions);

module.exports = router;