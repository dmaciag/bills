var express = require('express');
var router  = express.Router();

router.get('/', function(req, res){
    res.send('responsyyy');
});

router.get('/expenselist', function(req, res){

    var db = req.db;
    var expenses = db.get('expenses');

    expenses.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.post('/addexpense', function(req,res){

    var db = req.db;
    var expenses = db.get('expenses');
    expenses.insert( req.body, function(err, result){
        console.log('req.body : %o', req.body);
        console.log('err: %o',err);
        console.log('res: %o',result);
        res.send( 
            err !== null ? { msg : err} : { msg : 'good'}
        );
    });
    console.log('addExpense');

});

module.exports = router;