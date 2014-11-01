// server.js

//Base Setup
//========================

var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var signin = require('./login.js');
var session = require('express-session');


//Enivornment Variables
//========================

var port = process.env.OPENSHIFT_NODEJS_PORT || 3000 ;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var DB_URL = process.env.OPENSHIFT_MONGODB_DB_URL || 'localhost' ;

if ('production' == process.env.NODE_ENV){
  var env = { 'username': process.env.USERNAME ,
              'password': process.env.PASSWORD ,

             'session_key' : process.env.SESSION_KEY
          }

}
else {
	var env = require('./env.json');
}

//Connect to MongoDb
if (process.env.OPENSHIFT_MONGODB_DB_URL) {

mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL + 'bodasite');
}

else {
mongoose.connect('mongodb://localhost/test');
}


var Guest = require('./guest');

//Configure bodyParser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret: env.session_key}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

// Temporary Home of Routes
app.get('/login', signin.login);
app.post('/login', signin.check(env));

app.get('/', function(req, res){
	res.render('index');
});

app.post('/', function(req, res){
  var guest = new Guest();
  guest.firstName = req.body.firstName;
  guest.lastName = req.body.lastName;
  guest.email = req.body.email;
  guest.address1 = req.body.address1;
  guest.address2 = req.body.address2;
  guest.city = req.body.city;
  guest.country = req.body.country;
  guest.state = req.body.state;
  guest.zip = req.body.zipcode;



  guest.save(function(err) {
  	if (err)
  		res.send(err);
  	console.log('Saved it!')
  	res.render('success')
  })
});

app.get('/delete/:id', function(req, res){
  Guest.findById( req.params.id, function (err, guest){
guest.erased = true;
guest.save(function(req, res){
if (err) res.send(err);
console.log('erased it');});
})
res.redirect('/show');
});

app.get('/show', function(req, res) {
  Guest.find({$or:[{erased:false},{erased:{$exists:false}}]}, function(err, guests) {
    if (err)
      res.send(err);
    res.render('show' , {guestlist: guests});
  }); 
});

//Start the server
//==============
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
      });
    });

app.listen(port, ip_address, function (){
console.log('Express is listening on ' + ip_address + ' at port ' + port);
});

