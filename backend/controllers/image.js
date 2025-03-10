require('dotenv').config()

const generateImage = async (req, res) => {
    
    if (!req.body.prompt) {
        return res.status(400).json({ error: "No Prompt Found!" })
    }

    try {
        const response = await fetch('https://api.imagepig.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': `${process.env.IMAGE_PIG_API_KEY}`
            },
            body: JSON.stringify({ "prompt": req.body.prompt })
        })

        if (!response.ok) {
            errors = await response.text()
            console.log(errors)
            return res.status(response.status).json({ "error": "Failed to fetch image" })
        }

        const json = await response.json()
        const buffer = Buffer.from(json.image_data, 'base64')

        res.setHeader('Content-Type', 'image/jpeg')
        res.send(buffer)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { generateImage }