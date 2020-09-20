// Init DB before we start anything
require('./database/db').initDb()


var fs = require('fs');
const express = require('express')
const socketConfig = require('./socket/socket_config')
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
var bodyParser = require('body-parser');

const app = express()

var server
if(debug) {
    server = http.Server(app)
} else {
    var privateKey  = fs.readFileSync('../privkey.pem', 'utf8');
    var certificate = fs.readFileSync('../fullchain.pem', 'utf8');
    var credentials = {key: privateKey, cert: certificate};

    server = https.createServer(credentials, app);
}


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

const findBuddyRouter = require('./routers/find_buddy_router')
app.use('/find_buddy', findBuddyRouter)

socketConfig.configureServerSocketIO(server, session);


if(debug)
    server.listen(80);
else
    server.listen(443);
