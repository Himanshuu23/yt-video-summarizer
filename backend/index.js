const express = require('express')
const cors = require('cors')
const summaryRouter = require('./routes/summary.js')
const pdfRouter = require('./routes/pdf.js')

const app = express()

const PORT = 8000

app.use(cors());
app.use(express.json());
app.use('/', summaryRouter)
app.use('/', pdfRouter)

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
});