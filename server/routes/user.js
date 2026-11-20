const express = require("express");
const rateLimit = require("express-rate-limit");
const { signin, login, me, updateUserToken, checkout, syncOAuthUser } = require("../controllers/user");
const { requireAuth, requireInternal } = require("../middleware/auth");

const router = express.Router();

// Slow down brute-force login / signup attempts.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many attempts. Please try again later." },
});

router.post('/', authLimiter, signin);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, me);
router.patch('/token', requireAuth, updateUserToken);
router.post('/checkout', requireAuth, checkout);
router.post('/sync', requireInternal, syncOAuthUser);

// NOTE: the old PATCH /role endpoint was removed. Roles change only via checkout.

module.exports = router;
