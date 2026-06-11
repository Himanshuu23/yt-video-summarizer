require('dotenv').config();

const API_KEY = process.env.BART_API_KEY;
const API_URL = process.env.BART_API_URL_TWO;

const generateQuestions = async (data) => {
    console.log("this is the data: ", data)
    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}` },
        body: `Generate 10 questions **with answers** from : ${data}`
    })

    console.log("this is the response, ", response)
    const result = await response.json()
    console.log("this is the result, ", result)
    return result[0].generated_text
}

module.exports = { generateQuestions };