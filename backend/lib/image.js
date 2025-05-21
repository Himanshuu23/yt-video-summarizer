require('dotenv').config()

const generateImage = async (prompt = "monkey doing pushups") => {

    try {
        const response = await fetch('https://api.imagepig.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': `${process.env.IMAGE_PIG_API_KEY}`
            },
            body: JSON.stringify({ "prompt": prompt })
        })

        if (!response.ok) {
            return  "Failed to fetch image"
        }

        const json = await response.json()
        return json.image_data
    } catch (error) {
        return error
    }
}

module.exports = { generateImage }