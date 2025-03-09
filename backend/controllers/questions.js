require('dotenv').config();

const API_KEY = process.env.BART_API_KEY;
const API_URL = process.env.BART_API_URL_TWO;

const generateQuestions = async (req, res) => {
    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}` },
        body: `Generate 10 questions **with answers** from : ${req.body.data}`
    })

    const data = await response.json()
    console.log(data)
    return res.json({ res: data })
}

module.exports = { generateQuestions };