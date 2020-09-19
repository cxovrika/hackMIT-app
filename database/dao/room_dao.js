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

const verifyRoomCreator = (userName, roomID) => {
    try{
        // checks if room and user are mapped
        if(!verifyUserRoomMapping(userName, roomID)) return false
        const userID = getUserIDByName(userName)
        // checks if user is creator of room
        const room = getRoomByRoomID(roomID)
        if(room.length > 4){
            console.log("Error: room lenght shuldn't be more than 4 " + room.length)
            return false
        }
        const roomCreatorID = room[3]
        if(userID !== roomCreatorID) return false
        return true
    }catch(e){
        console.log(e)
        console.log("Unexpected error when verifying user " + userName + " to room with ID " + roomID)
        return false
    }
}

const verifyUserRoomMapping = (userName, roomID) => {
    try{
        const resultUserID = db.query(
            "select ru.userID from room_users as ru where ru.roomID = ?;", [roomID]
        )
        if(resultUserID.length === 0) return false
        const userID = getUserIDByName(userName)
        if(!resultUserID.contains(userID)) return false
        return true
    }catch (e) {
        console.log(e)
        console.log("Unexpected error when verifying user " + userName + " to room with ID " + roomID)
        return false
    }
}

const getRoomByRoomID = (roomID) => {
    const resultRoom = db.query(
        "select * from rooms as r where r.roomID = ?", [roomID]
    )

}

const getUserIDByName = (userName) => {
    try{
        const resultUser = db.query(
            "select u.ID from users as u where u.username = ? ", [userName])
        if(resultUser.length === 0) return null
        if(resultUser.length > 1){
            console.log("Error: user by " + userName + " is not unique")
            return null
        }
        return resultUser[0]
    }catch(e){
        console.log(e)
        console.log("Unexpected error when searching user " + userName + " by ID")
        return null
    }
}

module.exports = {
    getUserOwnedRooms,
    getUserRooms,
    createNewRoom,
    verifyRoomCreator
}