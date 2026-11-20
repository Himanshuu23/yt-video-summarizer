const express = require('express');
const generatePdf = require('../controllers/pdf');

const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, generatePdf)

module.exports = router;
