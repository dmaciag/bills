var express = require('express');
var mongo   = require('mongodb');
var monk    = require('monk');
var db      = monk('localhost:27017/bills');
var path    = require('path');
var app = express();

var expenses = require('./routes/expenses');


// app.use('/', routes);

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/home', function(req, res) {
  res.render('home');
});

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/expenses', expenses);
app.use(express.static( 'public'));

app.listen(3000);
