const  PDFDocument = require('pdfkit')
const pako = require("pako")

const generatePdf = (req, res) => {
        const { summary, theme, questions, buffer } = req.body;
        
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

        if (buffer) {  // ✅ Directly check if buffer exists
            try {
                // Decompress and decode Base64 string
                const decompressedBuffer = pako.inflate(Buffer.from(buffer, 'base64'), { to: 'string' });
        
                // Convert Base64 back to Buffer
                const imageBuffer = Buffer.from(decompressedBuffer, 'base64');
        
                // Ensure valid image buffer
                if (!imageBuffer || imageBuffer.length === 0) {
                    throw new Error('Invalid image buffer after decoding.');
                }
        
                // Add the image to the PDF
                doc.image(imageBuffer, { fit: [250, 250], align: 'center' });
        
            } catch (err) {
                console.error('Error processing image:', err.message);
            }
        }
        


        doc.fontSize(12).fillColor(theme === 'dark' ? 'white' : 'black').text('Questions & Answers', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).fillColor(theme == 'dark' ? 'white' : 'black').text(questions);
        doc.end();
}

module.exports = generatePdf;