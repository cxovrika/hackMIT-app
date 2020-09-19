const express = require('express')
const session = require('express-session')
var bodyParser = require('body-parser');
const app = express()
const server = require('http').Server(app)
const database = require('./database/db')
database.initDb()

app.set('view engine', 'ejs')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.use(session({   
    // It holds the secret key for session 
    secret: 'SO_SECRET', 
  
    // Forces the session to be saved 
    // back to the session store 
    resave: true,
  
    // Forces a session that is "uninitialized" 
    // to be saved to the store 
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    res.redirect('/homepage')
})

app.get('/homepage', (req, res) => {
    res.render('homepage')
})

app.get('/room', (req, res) => {
    res.render('room', {roomID : 5})
})

const userRouter = require('./routers/user_router')
app.use('/user', userRouter)

const roomRouter = require('./routers/room_router')
app.use('/room', roomRouter)

server.listen(3000)