var express = require('express');
var router  = express.Router();

router.get('/', function(req, res){
    res.send('need a response');
});

router.post('/addincome', function(req, res){

    var db = req.db;
    var incomes = db.get('incomes');

    incomes.insert( req.body, function(err, result){
        res.send( 
            err !== null ? { msg : err} : { msg : 'success'}
        );
    });

});

router.get('/incomelist', function(req, res){

    var db = req.db;
    var incomes = db.get('incomes');

    incomes.find({},{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;