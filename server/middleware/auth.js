const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prismaClient");

const JWT_SECRET = process.env.JWT_SECRET;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

// Fail closed: never start with a missing/weak signing secret.
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long.");
}
if (!INTERNAL_API_SECRET || INTERNAL_API_SECRET.length < 32) {
    throw new Error("INTERNAL_API_SECRET must be set and at least 32 characters long.");
}

const TOKEN_TTL = "7d";

function signToken(user) {
    return jwt.sign({ sub: String(user.id), email: user.email }, JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: TOKEN_TTL,
    });
}

// Verifies the Bearer token and loads the user from the DB, so role/tokens
// always come from the database and never from the request body.
async function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Please sign in to continue." });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
        const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });

        if (!user) {
            return res.status(401).json({ error: "Account not found. Please sign in again." });
        }

        req.user = user;
        return next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
            return res.status(401).json({ error: "Session expired. Please sign in again." });
        }
        console.error("[requireAuth]", error);
        return res.status(500).json({ error: "Could not verify your session." });
    }
}

// For server-to-server calls only (the Next.js server after an OAuth login).
function requireInternal(req, res, next) {
    const provided = Buffer.from(String(req.headers["x-internal-secret"] || ""));
    const expected = Buffer.from(INTERNAL_API_SECRET);

    if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
        return res.status(403).json({ error: "Forbidden." });
    }
    return next();
}

module.exports = { signToken, requireAuth, requireInternal };
