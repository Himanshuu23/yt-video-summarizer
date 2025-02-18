const express = require('express')
const cors = require('cors')
const summaryRouter = require('./routes/summary.js')
const pdfRouter = require('./routes/pdf.js')
const { translate } = require('@vitalets/google-translate-api')

const app = express()

const PORT = 8000

app.use(cors());
app.use(express.json());
app.use('/', summaryRouter)
app.use('/', pdfRouter)

app.post('/translate', (req, res) => {
    const { text, lang } = req.body

    translate(text, { to: lang })
    .then(response => {
        res.json({ translatedText: response.text })
    })
    .catch(error => {
        res.status(500).json({ error: error })
    })
})

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
});