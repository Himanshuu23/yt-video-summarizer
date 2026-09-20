const prisma = require("../utils/prismaClient");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const PLANS = {
    PRO: { role: "PRO", tokens: 250, amount: 5 },
    PREMIUM: { role: "PREMIUM", tokens: 600, amount: 12 },
};

const ROLE_RANK = { FREE: 0, PRO: 1, PREMIUM: 2 };

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

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email and password are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        return res.status(201).json(publicUser(user));
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ error: "An account with this email already exists." });
        }
        return res.status(500).json({ error: "Could not create account." });
    }
}

async function login(req, res) {
    const email = req.query.email;
    const password = req.query.password;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            return res.json({ user: publicUser(user) });
        }

        return res.status(401).json({ error: "Invalid email or password." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function updateUserRole(req, res) {
    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ error: "Email and role are required." });
    }

    try {
        const updated = await prisma.user.update({
            where: { email },
            data: { role },
        });
        return res.json(publicUser(updated));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function updateUserToken(req, res) {
    const { email, amount } = req.body;

    if (!email || typeof amount !== "number") {
        return res.status(400).json({ error: "Email and amount are required." });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const nextToken = Math.max(0, user.token + amount);
        const updated = await prisma.user.update({
            where: { email },
            data: { token: nextToken },
        });
        return res.json(publicUser(updated));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function checkout(req, res) {
    const { email, plan } = req.body;
    const config = PLANS[plan];

    if (!email || !config) {
        return res.status(400).json({ error: "A valid plan is required." });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const currentRank = ROLE_RANK[user.role] ?? 0;
        const planRank = ROLE_RANK[config.role] ?? 0;
        const nextRole = currentRank > planRank ? user.role : config.role;

        const updated = await prisma.user.update({
            where: { email },
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
        return res.status(500).json({ error: error.message });
    }
}

async function syncOAuthUser(req, res) {
    const email = req.query.email;
    const name = req.query.name || email?.split("@")[0] || "User";

    if (!email) {
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

        return res.json({ user: publicUser(user) });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    signin,
    login,
    updateUserRole,
    updateUserToken,
    checkout,
    syncOAuthUser,
}