var sharedsession = require("express-socket.io-session");
const roomDao = require('../database/dao/room_dao')


const buddySeekers = {}

const tryToFindMatches = () => {
    console.log("Trying to find matches!");
    const seekers = Object.entries(buddySeekers);
    for (let i = 0; i < seekers.length; i++) {
        console.log("user", i);
        const seeker = seekers[i][1];
        const interests = seeker.interests;


        const desiredBuddyCount = seeker.buddyCount;
        const validBuddies = [];

        for (let intidx = 0; intidx < interests.length; intidx++) {
            const interest = interests[intidx];
            console.log("chekcing interest", interest)

            for (let j = i + 1; j < seekers.length; j++) {
                const otherSeeker = seekers[j][1];
                const otherInterests = otherSeeker.interests;
                const otherDesiredBuddyCount = otherSeeker.buddyCount;
                
                console.log("checking", interest, "in", otherInterests)
                if (!(otherInterests.includes
                    
                    (interest))) continue;
                console.log("good 1", desiredBuddyCount, otherDesiredBuddyCount)
                if (desiredBuddyCount !== otherDesiredBuddyCount) continue;
                console.log("good 2")
                
                validBuddies.push(otherSeeker);
            }
            
            console.log("Totally", validBuddies.length, desiredBuddyCount - 1)
            if (validBuddies.length < desiredBuddyCount - 1) continue;


            validBuddies.push(seeker);


            let roomName = 'Study room for: ';
            // console.log("->>>>.", validBuddies)
            for (let buddy in validBuddies) {
                buddy = validBuddies[buddy];
                // console.log(buddy)
                roomName += buddy.user.username + ' ';
            }
            const roomID = roomDao.createNewRoom(validBuddies[0].user.username, roomName);
            if (roomID === null) return; // Something went wrong
            
            console.log("Found squad!", validBuddies);
            // Inform users to join a room
            for (let buddy in validBuddies) {
                buddy = validBuddies[buddy];
                buddy.socket.emit('buddy-found', roomID);
                delete buddySeekers[buddy.user.ID];
            }
            return;
        }
    }
    


    // for (const otherSeekerId in buddySeekers) {
    //     if (newSeekerId == otherSeekerId) continue; // use double equals as id is converted to string for keys

    //     const interestsA = buddySeekers[otherSeekerId].interests;
    //     const interestsB = buddySeekers[newSeekerId].interests;
    //     const commonInterests = interestsA.filter(x => interestsB.includes(x));

    //     if (commonInterests.length == 0) continue;
    //     return otherSeekerId;
    // }

    // return null;
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

        socket.on('find-buddy', (interests, buddyCount) => {
            buddySeekers[user.ID] = {
                user: user,
                interests: interests,
                buddyCount: buddyCount,
                socket: socket,
            };

            console.log("Received user with buddyCount", buddyCount);

            // console.log("Started search, ", user)
            // console.log("cur seekers, ", buddySeekers)

            // const buddyId = tryToFindBuddies(user.ID)
            // if (buddyId === null) return;

            // const buddy = buddySeekers[buddyId].user
            // const userSocket = buddySeekers[user.ID].socket
            // const buddySocket = buddySeekers[buddyId].socket

            // const roomName = `Study room for ${user.username} and ${buddy.username}`;
            // const roomID = roomDao.createNewRoom(user.username, roomName);
            // if (roomID === null) return; // Something went wrong
            
            // // Inform users to join a room
            // userSocket.emit('buddy-found', roomID);
            // buddySocket.emit('buddy-found', roomID);

            
            // delete buddySeekers[user.ID];
            // delete buddySeekers[buddy.ID];
        })

        socket.on('stop-searching', () => {
            delete buddySeekers[user.ID];
            // console.log("Stopped search, ", user)
            // console.log("cur seekers, ", buddySeekers)

        })
    })

    setInterval(tryToFindMatches, 3 * 1000);
}

module.exports = {
    configureServerSocketIO
}