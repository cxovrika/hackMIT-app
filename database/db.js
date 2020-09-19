var mysql = require('mysql');
const assert = require("assert");

let _db;


function initDb() {
    if (_db) {
        console.warn("Trying to init DB again!");
        
    }
    
    _db = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'hackmit'
    });
    
    _db.connect();
    console.log("Connected to databaase!")
}

function getDb() {
    assert.ok(_db, "Db has not been initialized. Please call init first.");
    return _db;
}

module.exports = {
    getDb,
    initDb
};