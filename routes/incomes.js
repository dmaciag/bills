var express = require('express');
var router  = express.Router();

router.post('/addincome', function(req, res){

    var db = req.db;
    var incomes = db.get('incomes');

    expenincomesses.insert( req.body, function(err, result){
        res.send( 
            err !== null ? { msg : err} : { msg : 'success'}
        );
    });

});

router.get('/loadincomes', function(req, res){

    var db = req.db;
    var incomes = db.get('incomes');

    incomes.find({},{},function(e,docs){
        res.json(docs);
    });
});