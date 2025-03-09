const { translate } = require('@vitalets/google-translate-api')

const translateText = (req, res) => {
    const { text, lang } = req.body

    translate(text, { to: lang })
    .then(response => {
        res.json({ translatedText: response.text })
    })
    .catch(error => {
        console.log(error)
	res.status(500).json({ error: error })
    })
}

module.exports = translateText;
