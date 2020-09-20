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

const getUser = (username) => {
    const result = db.query(
        'SELECT * from users WHERE username = ?',
        [username],
    );

    if (result.length === 0) {
        return null;
    }
    return result[0];
}

const createUser = (userName, userPassword, userEmail) => {
    try {
        const result = db.query(
            'INSERT INTO users (username,password,email)  VALUES(?,?,?);',
            [userName, userPassword, userEmail],
        )
        console.log('new user created:' + userName)
        return true
    }
    catch (e){
        console.log(e)
        console.log('faled to crete new user:' + userName)
        return false
    }
}

const getUserByID = (userID) => {
    try{
        const users = db.query(
            "select * from users as u where u.ID = ?", [userID]
        )
        if(users.length === 0) return null
        return users[0]
    }
    catch(e) {
        console.log(`Unexpected error when searching for users by ID: ${userID}`, e);
        return null
    }
}


module.exports = {
    getUserByEmail,
    createUser,
    getUser,
    getUserByID
};