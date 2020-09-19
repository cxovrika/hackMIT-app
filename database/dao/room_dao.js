db = require('../db').getDb()
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


module.exports = {
    getUserOwnedRooms,
    getUserRooms,
}