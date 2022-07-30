require("dotenv").config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.json())

const users = []

const posts = [{
    username: 'Kyle',
    title: 'Post 1'
}, {
    username: 'John',
    title: 'Post 2'
}, {
    username: 'Jim',
    title: 'Post 3'
}]

let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ username: user.username })
        res.json({accessToken:accessToken})
    })
})


app.post('/signup', async (req, res) => {

    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { username: req.body.username, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }


})

app.post('/login', async (req, res) => {
    const user = users.find(user => user.username = req.body.username)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const username = req.body.username;
            const user = { username: username }

            const accessToken = generateAccessToken(user)
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
            refreshTokens.push(refreshToken)
            res.json({ accessToken: accessToken, refreshToken: refreshToken }).status(200)
        } else {
            res.status(404).send('Not allowed')
        }
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

app.delete('/logout',(req,res)=>{
    console.log('hai')
    refreshTokens=refreshTokens.filter((token)=>{return token!==req.body.token})
    res.sendStatus(204)
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20S' })
}

app.listen(4000, () => {
    console.log('Server running on port 4000')
})