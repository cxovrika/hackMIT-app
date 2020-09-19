db = require('../db').getDb()

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


module.exports = {
    verifyRoomCreator
}