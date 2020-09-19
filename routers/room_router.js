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

module.exports = router
