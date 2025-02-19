const express = require('express');
const generatePdf = require('../controllers/pdf');

const router = express.Router();

router.post('/', generatePdf)

module.exports = router;