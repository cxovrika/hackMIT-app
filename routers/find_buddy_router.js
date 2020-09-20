var express = require('express')
var categoryDao = require('../database/dao/category_dao')
var router = express.Router()

router.get('/', (req, res) => {
    if (req.session.user === undefined){
        return res.render('homepage')
    }

    const categories = categoryDao.getAllCategories()
    res.render('find_buddy', {categories: categories})
})

module.exports = router
