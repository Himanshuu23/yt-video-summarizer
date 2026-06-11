const prisma = require("../utils/prismaClient");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

async function signin(req, res) {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10)
    
    try {
        return res.send(JSON.stringify(await prisma.user.create({
            data: {
                name,
                email, 
                password: hashedPassword
            }
        })))
        
    } catch (error) {
        return res.send(JSON.stringify(({ error: error })))
    }
}

async function login(req, res) {
    const email = req.query.email;
    const password = req.query.password;

    try {
        await prisma.$connect();

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (user && await bcrypt.compare(password, user.password)) {
            return res.send(JSON.stringify({ user: user }));
        }

        return res.send(JSON.stringify({ error: "User not found!" }));
    } catch (error) {
        return res.send(JSON.stringify({ error: error.message }));
    } finally {
        await prisma.$disconnect();
    }
}

async function updateUserRole(req, res) {
    const { email, role } = req.body;
    
    try {
        return res.send(JSON.stringify(await prisma.user.update({
            where: {
                email
            }, data: {
                role
            }
        })))
    } catch (error) {
        return res.send(JSON.stringify({ error: error }))
    }
}

async function updateUserToken(req, res) {
  const { email, amount } = req.body;
    console.log(email, amount)
  try {
    const user = await prisma.user.findUnique({ 
        where: { 
            email
        } 
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updated = await prisma.user.update({
      where: { email },
      data: { token: user.token + amount }
    });
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
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

        return res.json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    signin,
    login,
    updateUserRole,
    updateUserToken,
    syncOAuthUser,
}