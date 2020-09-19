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
    console.log("GET request received on user, doing nothing for now")
    res.render('login')
})

router.post('/login', (req, res) => {
    console.log("POST request received on user, doing nothing for now")
    var user = req.body.username
    var password = req.body.password
    realuser = userdao.getUser(user)
    if(realuser===null || realuser.password !== password){
        //res.redirect('/user/login?failed=true')
        res.render('login', {
            failed: true
        })
        return
    }
    console.log('printing realuser')
    console.log(realuser)

    req.session.user = realuser
    console.log("logged in!")
    res.redirect('/homepage')
})


module.exports = router
