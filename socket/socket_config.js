var sharedsession = require("express-socket.io-session");

const configureServerSocketIO = (server, session) => {
    const io = require('socket.io')(server)
    io.use(sharedsession(session, {
        autoSave:true
    }));
    
    io.on('connection', socket => {
        if(socket.handshake.session.user === undefined){
            return
        }
        
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId)
            socket.to(roomId).broadcast.emit('user-connected', userId)
    
            socket.on('disconnect', () => {
                socket.to(roomId).broadcast.emit('user-disconnected', userId)
            })
        })
    })}

module.exports = {
    configureServerSocketIO
}