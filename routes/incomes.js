var express = require('express');
var router  = express.Router();

router.get('/', function(req, res){
    res.send('need a response');
});

router.post('/addincome', function(req, res){

    var db = req.db;
    var incomes = db.get('incomes');

    incomes.insert( req.body, function(err, result){
        if(err != null) res.send('Insert Income Error');
        else res.redirect('/');

    });
});

router.get('/incomelist', function(req, res){

    var db = req.db;
    var incomes = db.get('incomes');

    incomes.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.delete('/deleteincome/:id', function(req, res){
    
    var db = req.db;
    var incomes = db.get('incomes');
    
    var incomeToDelete = req.params.id;
    incomes.remove({ '_id' : incomeToDelete }, function(err){
        res.send(
           (err !== null) ? { msg : err } : { msg : 'success' }
        );
    });
});

module.exports = router;