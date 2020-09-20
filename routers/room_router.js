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
    if (roomDao.verifyRoomCreator(user, roomID)) {
        res.render('room_configuration')
    } else {
        res.redirect('/homepage')
    }
})

router.post('/room_configuration', (req, res) => {
    console.log("POST request received on room_configuration, doing nothing for now")

    res.render('room_configuration')
})

router.get('/:roomID', (req, res) => {
    console.log(req.params.roomID)
    room = req.params.roomID
    res.render('room', {roomID: room})
})


module.exports = router
