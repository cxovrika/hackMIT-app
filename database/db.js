const MySql = require('sync-mysql');
const assert = require("assert");

let _db;

const initDb = () => {
    if (_db) {
        console.warn("Trying to init DB again!");
        
    }
    
    _db = new MySql({
        host: 'localhost',
        user: 'root',
        database: 'hackmit',
        password: 'root'
    });

    console.log("Connected to databaase!")
}

const getDb = () => {
    assert.ok(_db, "Db has not been initialized. Please call init first.");
    return _db;
}

module.exports = {
    getDb,
    initDb
};