db = require('../db').getDb()
const {v4: uuidV4} = require('uuid')
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
    } catch (e) {
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
    } catch (e) {
        console.log(`Failed to load rooms for user ${username}`, e);
        return [];
    }
}

const verifyRoomCreator = (user, roomID) => {
    try {
        // checks if room and user are mapped
        const userID = user.ID
        // checks if user is creator of room
        const room = getRoomByRoomID(roomID)
        if (room == null) return false

        const roomCreatorID = room.roomCreatorID

        if (userID !== roomCreatorID) return false
        return true
    } catch (e) {
        console.log("Unexpected error when verifying user " + user.username + " to room with ID " + roomID, e)
        return false
    }
}

const getRoomByRoomID = (roomID) => {
    try {
        const resultRoom = db.query(
            "select * from rooms as r where r.roomID = ?", [roomID]
        )
        return resultRoom[0]
    } catch (e) {
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
        return roomId;
    } catch (e) {
        console.log(`Failed to create a room from user ${username} with name ${roomName}`, e);
        return null;
    }
}


const getUsersFromRoom = (roomRoomID) => {
    try {
        room = getRoomByRoomID(roomRoomID)
        roomID = room.ID
        const results = db.query(
            "select ru.userID from room_users as ru where ru.roomID = ?", [roomID]
        )

        users = []
        results.forEach(result => {
            users.push(userDao.getUserByID(result.userID))
        })
        return users
    } catch (e) {
        console.log(`Unexpected error when searching for users by roomID: ${roomID}`, e);
        return null
    }
}

const verifyUserInRoom = (roomRoomID, userID) => {
    try{
        users = getUsersFromRoom(roomRoomID)
        return users.some( element => element.ID === userID)
    }
    catch (e) {
        console.log(`VerifyUserInRoom error when searching for users by roomID: ${userID} ${roomID}`, e);
        return false
    }
}

const addUserToRoom = (roomRoomID, userName) => {
    if(userName === '') return false
    try {
        user = userDao.getUser(userName)
        if(verifyRoomCreator(user, roomRoomID)) return false
        userID = user.ID
        if (verifyUserInRoom(roomRoomID, userID)) return false
        room = getRoomByRoomID(roomRoomID)
        roomID = room.ID
        const result = db.query(
            "insert into room_users (userID, roomID) values(?, ?);",
            [userID, roomID]
        )
        console.log('new user' + userID + ' added to room ' + roomRoomID)
        return true
    } catch (e) {
        console.log(`Failed to add user: ${user} to room: ${roomRoomID}`, e);
        return false
    }

}

const removeUserFromRoom = (roomRoomID, userName) => {
    if(userName === '') return false
    try {
        user = userDao.getUser(userName)
        userID = user.ID
        if (!verifyUserInRoom(roomRoomID, userID)) return false
        room = getRoomByRoomID(roomRoomID)
        roomID = room.ID
        const result = db.query(
            "delete from room_users as ru where ru.userID = ?",
            [userID]
        )
        console.log('user' + userID + ' removed from room ' + roomRoomID)
        return true
    } catch (e) {
        console.log(`Failed to remove user: ${user} to room: ${roomRoomID}`, e);
        return false
    }
}

const changeRoomName = (roomRoomID, roomName) =>{
    if(roomName === '') return false
    try{
        room = getRoomByRoomID(roomRoomID)
        roomID = room.ID
        const result = db.query(
            "update rooms set roomName = ? where ID = ?",
            [roomName, roomID]
        )
        console.log("Updated room " + roomRoomID + " name to " + roomName)
        if(result.chagedRows > 1) return false
        return true
    }
    catch (e) {
        console.log(`Failed to change room name user: ${roomRoomID} to name: ${roomName}`, e);
        return false
    }
}

module.exports = {
    getUserOwnedRooms,
    getUserRooms,
    createNewRoom,
    verifyRoomCreator,
    getUsersFromRoom,
    addUserToRoom,
    removeUserFromRoom,
    changeRoomName,
    getRoomByRoomID
}