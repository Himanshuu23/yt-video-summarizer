const express = require('express');

const multer = require('multer');

const { summarizeVideo } = require('../controllers/summary');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/url', summarizeVideo)

router.post('/file', upload.single('file'), async (req, res) => {
    // due...
});

module.exports = router;

{/*
4. The pdf should look much better (include the flowchart, question, images, formulae etc as mentioned in the notepad file)   
5. In the demo use static data for maths formulae and summary and images - to fool the people for the same and then later excuse that it was when i was using amazing api but now its limit is reached so using the bad one now
6. Payments using RazorPay
*/}