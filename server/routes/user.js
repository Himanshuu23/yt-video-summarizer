const express = require("express");
const { signin, login, updateUserRole, updateUserToken, checkout, syncOAuthUser } = require("../controllers/user");

const router = express.Router();

router.post('/', signin);
router.get('/', login);
router.patch('/role', updateUserRole);
router.patch('/token', updateUserToken);
router.post('/checkout', checkout);
router.get('/sync', syncOAuthUser);

module.exports = router;