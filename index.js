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

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter((data) => { return data.username == req.user.username }))
})

app.get('/signup', (req, res) => {
    res.json(users)
})

// app.post('/signup', async (req, res) => {

//     try {

//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         const user = { username: req.body.username, password: hashedPassword }
//         users.push(user)
//         res.status(201).send()
//     } catch (error) {
//         console.log(error)
//         res.status(500).send()
//     }


// })

// app.post('/login', async (req, res) => {
//     const user = users.find(user => user.username = req.body.username)
//     if (user == null) {
//         return res.status(400).send('Cannot find user')
//     }
//     try {
//         if (await bcrypt.compare(req.body.password, user.password)) {
//             const username = req.body.username;
//             const user = { username: username }

//             const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })

//             res.json({ accessToken: accessToken }).status(200)
//         } else {
//             res.status(404).send('Not allowed')
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).send()
//     }
// })

function authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]


    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        console.log(req.user)
        next()
    })


}

app.listen(3000, () => {
    console.log('Server running on port 3000')
})