db = require('../db').getDb()

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
    verifyRoomCreator
}