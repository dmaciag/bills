var express = require('express');
var router  = express.Router();

router.get('/', function(req, res){
    res.send('responsyyy');
});

router.get('/expenselist', function(req, res){

    var db = req.db;
    var collection = db.get('expenses');

    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.post('/addExpense', function(req,res){
    console.log('addExpense');
});

module.exports = router;