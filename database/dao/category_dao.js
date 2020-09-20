db = require('../db').getDb()

const getAllCategories = () => {
    try {
        const categories = db.query(
            'SELECT * from categories'
        );
        return categories;
    } catch (e) {
        console.log('Failed to loadcategories', e);
        return [];
    }
}

module.exports = {
    getAllCategories
}