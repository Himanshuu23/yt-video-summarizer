const express = require('express');

const multer = require('multer');

const { summarizeVideo } = require('../controllers/summary');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/url', summarizeVideo)

router.post('/file', upload.single('file'), async (req, res) => {
    // due for a while for the same 
});

module.exports = router;

{/*
1. Refactor the code and test the new endpoints using postman
2. Do the translation part - from the frontend 
3. Also since by default the language would be english maybe check if the model accuracies can be corrected if we retranslate the text in english using the google api
4. The pdf should look much better (include the flowchart, question, images, formulae etc as mentioned in the notepad file)   
5. In the demo use static data for maths formulae and summary and images - to fool the people for the same and then later excuse that it was when i was using amazing api but now its limit is reached so using the bad one now
6. Payments using RazorPay
*/}