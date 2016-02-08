var express = require('express');
var stormpath = require('express-stormpath');

var app = express();

app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(stormpath.init(app, {
  website: true,
  expand: {
    customData: true
  }
}));

app.get('/', function(req, res) {
  res.render('home.html');
});

app.get('/profile', function(req, res) {
  res.render('profile.html');
});

app.on('stormpath.ready',function(){
  console.log('Stormpath Ready');
  app.listen(3000);
});