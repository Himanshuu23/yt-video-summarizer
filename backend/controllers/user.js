const prisma = require("../utils/prismaClient");
const bcrypt = require("bcrypt")

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

    console.log(email, password)
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (await bcrypt.compare(password, user.password)) {
            return res.send(JSON.stringify({ user: user }))
        }

        return res.send(JSON.stringify({ error: "User not found!" }))
    } catch (error) {
        return res.send(JSON.stringify({ error: error }))
    }
}

async function updateUserRole(req, res) {
    const { email, role } = req.body;
    
    try {
        return res.send(JSON.stringify(await prisma.update({
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
    const { email, amount } = req.body

    try {
        return res.send(JSON.stringify(await prisma.update({
            where: {
                email
            }, data: {
                token: token + amount
            }
        })))
    } catch (error) {
        return res.send(JSON.stringify({ error: error }))
    }
}

module.exports = {
    signin,
    login,
    updateUserRole
}