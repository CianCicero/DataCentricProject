var express = require('express');
var app = express();
var mysql = require('promise-mysql');
var pool;

mysql.createPool
({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2023',
    port: 3306
})
.then(p => {
    pool = p;
    console.log("Connected to MySQL");
})

.catch(err => {
    console.log("Error connecting to MySQL");
    console.log(err);
});

function displayStores(){
    return new Promise(function(resolve, reject){
        pool.query("SELECT * FROM store")
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
        })
}

module.exports = {
    displayStores
}