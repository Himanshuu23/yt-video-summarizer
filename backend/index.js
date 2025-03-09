const express = require('express')
const cors = require('cors')
const summaryRouter = require('./routes/summary.js')
const pdfRouter = require('./routes/pdf.js')
const translateRouter = require('./routes/translate.js')
const questionRoute = require('./routes/questions.js')
const imageRoute = require('./routes/image.js')

const app = express()

const PORT = 8000

app.use(cors());
app.use(express.json());
app.use('/summarize', summaryRouter)
app.use('/pdf', pdfRouter)
app.use('/translate', translateRouter)
app.use('/generate-questions', questionRoute)
app.use('/generate-image', imageRoute)

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
});