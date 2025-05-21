const express = require("express");
const { signin, login, updateUserRole, updateUserToken, getUserByEmail } = require("../controllers/user");

const router = express.Router();

router.post('/', signin);
router.get('/', login);
router.patch('/role', updateUserRole);
router.patch('/token', updateUserToken);
router.get('/data', updateUserToken);

module.exports = router;