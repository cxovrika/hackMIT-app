var express = require('express')
var roomsDao = require('../database/dao/room_dao')
var router = express.Router()

router.get('/', (req, res) => {
    console.log("GET request received on homepage")
    sess = req.session

    if (sess.user === undefined){
        return res.render('homepage')
    }

    const user = sess.user;
    const rooms = roomsDao.getUserRooms(user.username);
    
    res.render('homepage_logged', {
        user: user,
        rooms: rooms,
    })
})

module.exports = router
