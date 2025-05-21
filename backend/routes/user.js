const express = require("express");
const { signin, login } = require("../controllers/user");

const router = express.Router();

router.post('/', signin);
router.get('/', login);
router.post('/role', login);

module.exports = router;