const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
let ejs = require('ejs'); 
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mysql = require('mysql');
var sql = require('./server/sqlDAO.js');
var mongo = require('./server/mongoDAO.js');

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', (req, res) => res.render('index.ejs'));

app.get('/stores', (req, res) => {
    sql.displayStores()
        .then((data) => {
            res.render('stores.ejs', {stores: data});
        })
        .catch((err) => {
            console.log(err);
            res.render('error.ejs');
        })
});

