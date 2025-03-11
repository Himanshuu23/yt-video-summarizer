const express = require('express')
const cors = require('cors')
const summaryRouter = require('./routes/summary.js')
const pdfRouter = require('./routes/pdf.js')
const translateRouter = require('./routes/translate.js')

const app = express()

const PORT = 8000

app.use(cors());
app.use(express.json());
app.use('/summarize', summaryRouter)
app.use('/pdf', pdfRouter)
app.use('/translate', translateRouter)

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
});