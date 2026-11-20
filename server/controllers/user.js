const prisma = require("../utils/prismaClient");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { signToken } = require("../middleware/auth");

const PLANS = {
    PRO: { role: "PRO", tokens: 250, amount: 5 },
    PREMIUM: { role: "PREMIUM", tokens: 600, amount: 12 },
};

const ROLE_RANK = { FREE: 0, PRO: 1, PREMIUM: 2 };

// Largest single deduction the client may request (sum of all feature costs is 155).
const MAX_TOKEN_DEDUCTION = 500;

function publicUser(user) {
    return {
        name: user.name,
        email: user.email,
        token: user.token,
        role: user.role,
    };
}

async function signin(req, res) {
    const { name, email, password } = req.body;

    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string"
        || !name.trim() || !email.trim() || !password) {
        return res.status(400).json({ error: "Name, email and password are required." });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name: name.trim(), email: email.trim(), password: hashedPassword },
        });
        return res.status(201).json(publicUser(user));
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ error: "An account with this email already exists." });
        }
        return res.status(500).json({ error: "Could not create account." });
    }
}

// POST /api/user/login  (credentials in the body, never in the URL)
async function login(req, res) {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: email.trim() } });

        if (user && await bcrypt.compare(password, user.password)) {
            return res.json({ user: publicUser(user), accessToken: signToken(user) });
        }

        return res.status(401).json({ error: "Invalid email or password." });
    } catch (error) {
        console.error("[login]", error);
        return res.status(500).json({ error: "Could not sign in." });
    }
}

// GET /api/user/me  (requireAuth)
async function me(req, res) {
    return res.json({ user: publicUser(req.user) });
}

// PATCH /api/user/token  (requireAuth) - own account, deductions only.
// Adding tokens is only possible through checkout.
async function updateUserToken(req, res) {
    const { amount } = req.body;

    if (!Number.isInteger(amount) || amount > 0 || amount < -MAX_TOKEN_DEDUCTION) {
        return res.status(400).json({ error: "Invalid token amount." });
    }

    try {
        const nextToken = Math.max(0, req.user.token + amount);
        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: { token: nextToken },
        });
        return res.json(publicUser(updated));
    } catch (error) {
        console.error("[updateUserToken]", error);
        return res.status(500).json({ error: "Could not update tokens." });
    }
}

// POST /api/user/checkout  (requireAuth) - applies to the signed-in user only.
// NOTE: this is still a mock; no payment is actually taken.
async function checkout(req, res) {
    const { plan } = req.body;
    const config = PLANS[plan];

    if (!config) {
        return res.status(400).json({ error: "A valid plan is required." });
    }

    try {
        const user = req.user;
        const currentRank = ROLE_RANK[user.role] ?? 0;
        const planRank = ROLE_RANK[config.role] ?? 0;
        const nextRole = currentRank > planRank ? user.role : config.role;

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                token: user.token + config.tokens,
                role: nextRole,
            },
        });

        return res.json({
            ...publicUser(updated),
            receiptId: `SF-${Date.now().toString(36).toUpperCase()}`,
            tokensAdded: config.tokens,
            charged: config.amount,
            plan,
        });
    } catch (error) {
        console.error("[checkout]", error);
        return res.status(500).json({ error: "Payment could not be completed." });
    }
}

// POST /api/user/sync  (requireInternal) - called by the Next.js server after a
// verified Google/GitHub login. Creates the user if needed and returns a JWT.
async function syncOAuthUser(req, res) {
    const email = req.body.email;
    const name = req.body.name || (typeof email === "string" ? email.split("@")[0] : "") || "User";

    if (typeof email !== "string" || !email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            const hashedPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
            user = await prisma.user.create({
                data: { name, email, password: hashedPassword },
            });
        }

        return res.json({ user: publicUser(user), accessToken: signToken(user) });
    } catch (error) {
        console.error("[syncOAuthUser]", error);
        return res.status(500).json({ error: "Could not sync account." });
    }
}

module.exports = {
    signin,
    login,
    me,
    updateUserToken,
    checkout,
    syncOAuthUser,
}
