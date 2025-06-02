const express = require('express')
const cors = require('cors')
const summaryRouter = require('./routes/summary.js')
const pdfRouter = require('./routes/pdf.js')
const translateRouter = require('./routes/translate.js')
const userRouter = require('./routes/user.js')

const app = express()

const PORT = 8000

app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter)
app.use('/api/summarize', summaryRouter)
app.use('/api/pdf', pdfRouter)
app.use('/api/translate', translateRouter)

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
});