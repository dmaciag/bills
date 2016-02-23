var express = require('express');
var router  = express.Router();

router.get('/', function(req, res){
    res.send('need a response');
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
        if(err != null) res.send('Insert Income Error');
        else res.redirect('/');
    });
});

router.delete('/deleteexpense/:id', function(req, res){
    
    var db = req.db;
    var expenses = db.get('expenses');
    
    var expensesToDelete = req.params.id;
    expenses.remove({ '_id' : expensesToDelete }, function(err){
    	res.send(
	       (err !== null) ? { msg : err } : { msg : 'success' }
        );
	});
});

module.exports = router;
