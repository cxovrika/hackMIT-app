const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
// const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

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