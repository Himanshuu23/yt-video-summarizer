const express = require("express");
const { signin, login, updateUserRole, updateUserToken, syncOAuthUser } = require("../controllers/user");

const router = express.Router();

router.post('/', signin);
router.get('/', login);
router.patch('/role', updateUserRole);
router.patch('/token', updateUserToken);
router.get('/sync', syncOAuthUser);

module.exports = router;