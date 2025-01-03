const express = require('express')
const  PDFDocument = require('pdfkit')
const multer = require('multer');
const { extractTextFromDocument } = require('../utils/documentProcessor');
const { summarizeTextInChunks, cleanSummary } = require('../utils/summarization');

const router = express.Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

router.post('/generate-pdf', (req, res) => {
    const { summary, theme } = req.body;

    if (!summary) {
        return res.status(400).send('Summary is required');
    }

    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=summary.pdf', 
            'Content-Length': pdfData.length,
        }).end(pdfData);
    });

    if (theme === 'dark') {
        doc.fillColor('white');
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('black');
    } else {
        doc.fillColor('black');
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('white');
    }

    doc.fontSize(16).fillColor(theme === 'dark' ? 'white' : 'black').text('YouTube Video Summary', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).fillColor(theme === 'dark' ? 'white' : 'black').text(summary);

    doc.end();
});

module.exports = router