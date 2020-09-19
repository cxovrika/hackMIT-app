var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
    console.log("GET request received on user, doing nothing for now")
    res.redirect('/homepage')
})

router.post('/', (req, res) => {
    console.log("POST request received on user, doing nothing for now")
    res.redirect('/homepage')
})

module.exports = router
