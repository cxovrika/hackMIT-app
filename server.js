var fs = require('fs');

const express = require('express')

debug = true

var http, https
if(debug)
    http = require('http')
else
    https = require('https')

var session = require("express-session")({
    secret: "SO_SECRET",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");
var bodyParser = require('body-parser');

const app = express()
const database = require('./database/db')
var server
if(debug) {
    server = http.Server(app)
} else {
    var privateKey  = fs.readFileSync('../privkey.pem', 'utf8');
    var certificate = fs.readFileSync('../fullchain.pem', 'utf8');
    var credentials = {key: privateKey, cert: certificate};

    server = https.createServer(credentials, app);
}
const io = require('socket.io')(server)

database.initDb()

app.set('view engine', 'ejs')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'))


app.use(session)

app.get('/', (req, res) => {
    res.redirect('/homepage')
})

app.get('/room', (req, res) => {
    res.render('room', {roomID : 5})
})

const homepageRouter = require('./routers/homepage_router')
app.use('/homepage', homepageRouter)

const userRouter = require('./routers/user_router')
app.use('/user', userRouter)

const roomRouter = require('./routers/room_router')
app.use('/room', roomRouter)

io.use(sharedsession(session, {
    autoSave:true
}));

io.on('connection', socket => {
    if(socket.handshake.session.user === undefined){
        console.log(socket)
        return
    }
    socket.on('join-room', (roomId, userId) => {
        console.log(socket.handshake.session)
        console.log(userId + " joined " + roomId)
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})


if(debug)
    server.listen(80);
else
    server.listen(443);
