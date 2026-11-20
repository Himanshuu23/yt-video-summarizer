const express = require('express');

const multer = require('multer');

const { summarizeVideo, summarizeText } = require('../controllers/summary');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/url', requireAuth, summarizeVideo)

router.post('/file', requireAuth, upload.single('file'), summarizeText);

module.exports = router;
