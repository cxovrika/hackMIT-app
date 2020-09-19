var express = require('express')
var roomdao = require('../database/dao/room_dao')
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
    res.redirect('/homepage')
})

router.get('/room_configuration', (req, res) => {
    console.log("POST request received on room_configuration, doing nothing for now")
    var userName = req.body.username
    var roomID = req.body.roomID
    if(roomdao.verifyRoomCreator(userName, roomID))
        res.render('room_configuration')
    else res.render('homepage')
})

router.post('/room_configuration', (req, res) => {
    console.log("POST request received on room_configuration, doing nothing for now")

    res.render('room_configuration')
})

module.exports = router
