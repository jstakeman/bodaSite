// server.js

//Base Setup
//========================

var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');


//Enivornment Variables
//========================

var port = process.env.OPENSHIFT_NODEJS_PORT || 3000 ;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var DB_URL = process.env.OPENSHIFT_MONGODB_DB_URL || 'localhost' ;
var DB_NAME = 'bodaSite' || 'test';

//Connect to MongoDb
mongoose.connect('mongodb://' + DB_URL + '/' + DB_NAME);
var Guest = require('./guest');

//Configure bodyParser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Temporary Home of Routes

app.get('/', function(req, res){
	res.render('index');
});

app.post('/', function(req, res){
  var guest = new Guest();
  guest.firstName = req.body.firstName;
  guest.lastName = req.body.lastName;
  guest.zip = req.body.zipcode;

  guest.save(function(err) {
  	if (err)
  		res.send(err);
  	console.log('Saved it!')
  	res.render('success')
  })
});

app.get('/show', function(req, res) {
	Guest.find(function(err, guests) {
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

