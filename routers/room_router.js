var express = require('express')
var roomDao = require('../database/dao/room_dao')
var router = express.Router()

router.get('/', (req, res) => {
    console.log("GET request received on room")
    sess = req.session
    if(sess.user === undefined){
        return res.redirect('/homepage')
    }

    res.render('room')
})

router.post('/', (req, res) => {
    console.log("POST request received on room, doing nothing for now")
    const user = sess = req.session.user;
    if (user === undefined) {
        return res.redirect('/user/login');
    }

    const roomName = req.body.roomName;
    roomDao.createNewRoom(user.username, roomName)
    res.redirect('/homepage')
})

router.get('/room_configuration/:roomID', (req, res) => {
    console.log("GET request received on room_configuration, doing nothing for now")
    var user = req.session.user
    var roomID = req.params.roomID
    var room = roomDao.getRoomByRoomID(roomID)
    if (roomDao.verifyRoomCreator(user, roomID)) {
        roomUsers = roomDao.getUsersFromRoom(roomID)
        res.render('room_configuration', {roomID: roomID, roomName: room.roomName, roomUsers : roomUsers})
    } else {
        res.redirect('/homepage')
    }
})

router.post('/room_configuration/removeUser/:roomID', (req, res) => {
    console.log("POST request received on room_configuration/removeUser")
    console.log(req.body)
    var removeUser = req.body.removeUser
    var roomID = req.params.roomID
    roomDao.removeUserFromRoom(roomID, removeUser)
    res.redirect('/room/room_configuration/' + roomID) // eqneba isev get itadn oyolebuli?
})

router.post('/room_configuration/changeName/:roomID', (req, res) => {
    console.log("POST request received on room_configuration/remove")
    console.log(req.body)
    var roomName = req.body.roomName
    var roomID = req.params.roomID
    roomDao.changeRoomName(roomID, roomName)
    res.redirect('/room/room_configuration/' + roomID) // eqneba isev get itadn oyolebuli?
})

router.post('/room_configuration/addUser/:roomID', (req, res) => {
    console.log("POST request received on room_configuration/addUser")
    console.log(req.body)
    var addUser = req.body.addUser
    var roomID = req.params.roomID
    roomDao.addUserToRoom(roomID, addUser)
    res.redirect('/room/room_configuration/' + roomID) // eqneba isev get itadn oyolebuli?
})



// router.post('/room_configuration/:roomID', (req, res) => {
//     console.log("POST request received on room_configuration, doing nothing for now")
//     console.log(req.body)
//     var roomName = req.body.roomName
//     var addUser = req.body.addUser
//     var removeUser = req.body.removeUser
//     var roomID = req.params.roomID
//     console.log(roomName, addUser, removeUser)
//     roomDao.changeRoomName(roomID, roomName)
//     roomDao.addUserToRoom(roomID, addUser)
//     roomDao.removeUserFromRoom(roomID, removeUser)
//     res.redirect('/room/room_configuration/' + roomID) // eqneba isev get itadn oyolebuli?
// })

router.get('/:roomID', (req, res) => {
    console.log(req.params.roomID)
    room = req.params.roomID
    res.render('room', {roomID: room})
})


module.exports = router
