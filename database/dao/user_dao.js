db = require('../db').getDb()

const getUserByEmail = (userEmail) => {
    const result = db.query(
        'SELECT * from users WHERE email = ?',
        [userEmail],
    );

    if (result.length === 0) {
        return null;
    }
    return result[0];
}

module.exports = {
    getUserByEmail
};