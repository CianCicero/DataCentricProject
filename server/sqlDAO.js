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

function addAStore(sid, location, mgrid){
    return new Promise(function(resolve, reject){
        pool.query("INSERT INTO store (sid, location, mgrid) VALUES (?, ?, ?)", [sid, location, mgrid])
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
        })
}

function editStore(sid, location, mgrid){
    return new Promise(function(resolve, reject){
        pool.query("UPDATE store SET location = ?, mgrid = ? WHERE sid = ?", [location, mgrid, sid])
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
        })
}

function getAStoreByID(sid){
    return new Promise(function(resolve, reject){
        pool.query("SELECT * FROM store WHERE sid = ?", [sid])
            .then((data) => {
                resolve(data[0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
}

module.exports = {
    displayStores,
    addAStore,
    editStore,
    getAStoreByID
}