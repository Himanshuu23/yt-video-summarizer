const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const summaryRouter = require('./routes/summary.js')
const pdfRouter = require('./routes/pdf.js')
const translateRouter = require('./routes/translate.js')
const userRouter = require('./routes/user.js')

const app = express()

const PORT = 9000

// Set TRUST_PROXY=1 when running behind nginx / a load balancer so rate limits see the real client IP.
if (process.env.TRUST_PROXY) {
    app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1)
}

// Only the configured frontend origin(s) may call the API from a browser.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please wait a moment and try again." },
})

// Endpoints that spend paid AI / transcript credits get a much tighter limit.
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "You're summarizing too quickly. Please wait a moment and try again." },
})

app.use(generalLimiter)
app.use(express.json());
app.use('/api/user', userRouter)
app.use('/api/summarize', aiLimiter, summaryRouter)
app.use('/api/pdf', pdfRouter)
app.use('/api/translate', aiLimiter, translateRouter)

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
});
