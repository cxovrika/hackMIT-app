db = require('../db').getDb()
const { v4: uuidV4 } = require('uuid')
const userDao = require('./user_dao')

// Returns rooms where the given user is the creator
const getUserOwnedRooms = (username) => {

    try {
        const user = userDao.getUser(username);
        if (user === null)
            return [];

        const rooms = db.query(
            'SELECT * from rooms WHERE roomCreatorID = ?',
            [user.ID],
        );
        return rooms;
    }
    catch (e) {
        console.log(`Failed to load owned rooms for user ${username}`, e);
        return [];
    }
}

const getUserRooms = (username) => {
    try {
        userOwnedRooms = getUserOwnedRooms(username);
        ownedRoomIds = userOwnedRooms.map(r => r.ID);

        const otherRooms = db.query(
            `SELECT r.* 
            FROM users AS u, rooms AS r, room_users AS ru 
            WHERE  u.username = ?
                AND ru.userID = u.ID 
                AND ru.roomID = r.ID
            `,
            [username],
        )

        return userOwnedRooms.concat(
            otherRooms.filter(r => !(r.ID in ownedRoomIds))
        );
    }
    catch (e) {
        console.log(`Failed to load rooms for user ${username}`, e);
        return [];
    }
}

const verifyRoomCreator = (user, roomID) => {
    try{
        // checks if room and user are mapped
        const userID = user.ID
        // checks if user is creator of room
        const room = getRoomByRoomID(roomID)
        if (room == null) return false

        const roomCreatorID = room.roomCreatorID

        if(userID !== roomCreatorID) return false
        return true
    }catch(e){
        console.log("Unexpected error when verifying user " + user.username + " to room with ID " + roomID, e)
        return false
    }
}

const getRoomByRoomID = (roomID) => {
    try{
        const resultRoom = db.query(
            "select * from rooms as r where r.roomID = ?", [roomID]
        )
        return resultRoom[0]
    }catch (e) {
        console.log("Unexpected error when verifying roomID " + roomID, e)
        return null
    }

}
const createNewRoom = (username, roomName) => {
    try {
        const user = userDao.getUser(username);
        const roomId = uuidV4();
        db.query(
            'INSERT INTO rooms (roomID, roomName, roomCreatorID)  VALUES(?,?,?);',
            [roomId, roomName, user.ID],
        )
        return true;
    }
    catch(e) {
        console.log(`Failed to create a room from user ${username} with name ${roomName}`, e);
        return false;
    }
}


module.exports = {
    getUserOwnedRooms,
    getUserRooms,
    createNewRoom,
    verifyRoomCreator
}