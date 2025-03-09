const { generateQuestions } = require("../controllers/questions");
const express = require("express");

const router = express.Router();

router.post('/', generateQuestions);

module.exports = router;