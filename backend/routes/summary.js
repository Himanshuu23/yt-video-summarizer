const express = require('express');

const multer = require('multer');

const { summarizeVideo, summarizeText } = require('../controllers/summary');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/url', summarizeVideo)

router.post('/file', upload.single('file'), summarizeText);

module.exports = router;
