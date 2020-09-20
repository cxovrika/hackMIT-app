var sharedsession = require("express-socket.io-session");
const roomDao = require('../database/dao/room_dao')


const buddySeekers = {}

const tryToFindBuddy = (newSeekerId) => {
    for (const otherSeekerId in buddySeekers) {
        if (newSeekerId == otherSeekerId) continue; // use double equals as id is converted to string for keys

        const interestsA = buddySeekers[otherSeekerId].interests;
        const interestsB = buddySeekers[newSeekerId].interests;
        const commonInterests = interestsA.filter(x => interestsB.includes(x));

        if (commonInterests.length == 0) continue;
        return otherSeekerId;
    }

    return null;
}

const configureServerSocketIO = (server, session) => {
    const io = require('socket.io')(server)
    io.use(sharedsession(session, {
        autoSave:true
    }));
    
    io.on('connection', socket => {
        if(socket.handshake.session.user === undefined){
            return
        }
        const user = socket.handshake.session.user;

        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId)
            socket.to(roomId).broadcast.emit('user-connected', userId)
    
            socket.on('disconnect', () => {
                socket.to(roomId).broadcast.emit('user-disconnected', userId)
            })
        })

        socket.on('find-buddy', (interests) => {
            buddySeekers[user.ID] = {
                user: user,
                interests: interests,
                socket: socket,
            };

            // console.log("Started search, ", user)
            // console.log("cur seekers, ", buddySeekers)

            const buddyId = tryToFindBuddy(user.ID)
            if (buddyId === null) return;

            const buddy = buddySeekers[buddyId].user
            const userSocket = buddySeekers[user.ID].socket
            const buddySocket = buddySeekers[buddyId].socket

            const roomName = `Study room for ${user.username} and ${buddy.username}`;
            const roomID = roomDao.createNewRoom(user.username, roomName);
            if (roomID === null) return; // Something went wrong
            
            // Inform users to join a room
            userSocket.emit('buddy-found', roomID);
            buddySocket.emit('buddy-found', roomID);

            
            delete buddySeekers[user.ID];
            delete buddySeekers[buddy.ID];
        })

        socket.on('stop-searching', () => {
            delete buddySeekers[user.ID];
            // console.log("Stopped search, ", user)
            // console.log("cur seekers, ", buddySeekers)

        })
    })}

module.exports = {
    configureServerSocketIO
}