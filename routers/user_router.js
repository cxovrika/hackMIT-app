var express = require('express')
var userdao = require('../database/dao/user_dao')
var router = express.Router()



router.get('/register', (req, res) => {
    console.log("GET request received on user, doing nothing for now")
    res.render('register')
})

router.post('/register', (req, res) => {
    console.log("POST request received on user, doing nothing for now")
    console.log(req.body.username)
    console.log(req.body.password)
    console.log(req.body.email)
    if(userdao.createUser(req.body.username, req.body.password, req.body.email)){
        res.redirect('/user/login')
    }
    else {
        res.render('register', {
            failed: true
        })
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    var user = req.body.username
    var password = req.body.password
    var realuser = userdao.getUser(user)

    if(realuser===null || realuser.password !== password){
        res.render('login', {
            failed: true
        })
        return
    }

    req.session.user = realuser
    res.redirect('/homepage')
})


router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/homepage')
})


module.exports = router
