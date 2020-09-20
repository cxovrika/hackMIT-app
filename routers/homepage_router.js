var express = require('express')
var roomsDao = require('../database/dao/room_dao')
var usersDao = require('../database/dao/user_dao')
var router = express.Router()

router.get('/', (req, res) => {
    console.log("GET request received on homepage")
    sess = req.session

    if (sess.user === undefined){
        return res.render('homepage')
    }

    const user = sess.user;
    var rooms = roomsDao.getUserRooms(user.username);
    rooms = rooms.map((room)=> {
        // console.log(roomsDao.getUsersFromRoom(room.roomID))
        // console.log(usersDao.getUserByID(room.roomCreatorID))
        room.users = roomsDao.getUsersFromRoom(room.roomID)
        room.users.push(usersDao.getUserByID(room.roomCreatorID))
        return room
    })
    // console.log(rooms)
    // console.log(rooms[0].users)
    // console.log(rooms[0].users[0].username)
    res.render('homepage_logged', {
        user: user,
        rooms: rooms,
    })
})

module.exports = router
