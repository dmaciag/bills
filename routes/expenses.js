var express = require('express');
var router  = express.Router();

router.get('/', function(req, res){
    res.send('responsyyy');
});

router.get('/expenselist', function(req, res){
    console.log('in expenselist');
    var db = req.db;
    var collection = db.get('expenses');

    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;