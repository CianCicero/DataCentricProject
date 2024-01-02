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
mongo.connect();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', (req, res) => res.render('index.ejs'));

app.get('/stores', (req, res) => {
    sql.displayStores()
        .then((data) => {
            res.render('stores', {stores: data});
        })
        .catch((err) => {
            console.log(err);
            res.render('error');
        })
});

app.get('/stores/add', (req, res) => {
    res.render('addStore');
});

app.post('/stores/add', (req, res) => {
    sql.addAStore(req.body.sid, req.body.location, req.body.mgrid)
        .then((data) => {
            res.redirect('/stores');
        })
        .catch((err) => {
            console.log(err);
            res.render("error" + err);
        })
});

app.get('/stores/edit/:sid', (req, res) => {
    sql.getAStoreByID(req.params.sid)
        .then((data) => {
            res.render('editStore', {store: data});
        })
        .catch((err) => {
            console.log(err);
            res.render('error');
        })
});

app.post('/stores/:id', (req, res) => {
    sql.editStore(req.body.sid, req.body.location, req.body.mgrid)
        .then((data) => {
            res.redirect('/stores');
        })
        .catch((err) => {
            console.log(err);
            res.render("error" + err);
        })
});

app.post("/stores/delete/:id", (req, res) => {
    const storeId = req.params.id;
    sql
      .deleteAStore(storeId)
      .then(() => {
        res.redirect("/stores");
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.get('/products', (req, res) => {
    sql.getAllProducts()
        .then((data) => {
            res.render('products', {products: data});
        })
        .catch((err) => {
            console.log(err);
            res.render('error');
        })
    });

app.post("/products/delete", (req, res) => {
    sql.deleteProduct(req.body.pid)
        .then((data) => {
            res.redirect('/products');
        })
        .catch((err) => {
            console.log(err);
            res.render("error" + err);
        })
}); 

app.get("/managers", async (req, res) => {
    try {
        const db = mongo.getDb();
        const managers = await db.collection('managers').find({}).toArray();
        res.render('managers', { managers });
        
    } catch (err) {
        console.log(err);
        res.render("error" + err);
    }
});

app.get("/managers/add", (req, res) => {
    res.render('addAManager');
});

app.post("/managers/add", async (req, res) => {
    try {
        const db = mongo.getDb();
        const manager = {
            _id: req.body.mgrid,
            name: req.body.name,
            salary: req.body.salary
        };
        await db.collection('managers').insertOne(manager);
        res.redirect('/managers');
    }catch(err){
        console.log(err);
        res.render("error" + err);
    }
});
        