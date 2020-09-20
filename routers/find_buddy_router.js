var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
    if (req.session.user === undefined){
        return res.render('homepage')
    }

    res.render('find_buddy', {})
})

module.exports = router
