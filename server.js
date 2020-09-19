const express = require('express')
const session = require('express-session') 
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
// const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

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
// Session can be accessed with:
// req.session
// req.session.name = 'blah'




// Used to generate unique id for user, will be moved to server side, probably
// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

app.get('/', (req, res) => {
    res.redirect('/homepage')
})

app.get('/homepage', (req, res) => {
    res.render('homepage')
})

const userRouter = require('./routers/user_router')
app.use('/user', userRouter)

const roomRouter = require('./routers/room_router')
app.use('/room', roomRouter)

// io.on('connection', socket => {
//   socket.on('join-room', (roomId, userId) => {
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected', userId)

//     socket.on('disconnect', () => {
//       socket.to(roomId).broadcast.emit('user-disconnected', userId)
//     })
//   })
// })

server.listen(3000)