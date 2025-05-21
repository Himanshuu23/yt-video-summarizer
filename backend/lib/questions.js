require('dotenv').config();

const API_KEY = process.env.BART_API_KEY;
const API_URL = process.env.BART_API_URL_TWO;

const generateQuestions = async (data) => {
    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}` },
        body: `Generate 10 questions **with answers** from : ${data}`
    })

    const result = await response.json()
    return result[0].generated_text
}

module.exports = { generateQuestions };