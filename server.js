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

//Configure bodyParser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Temporary Home of Routes

app.get('*', function(req, res){
  res.render('index');
});

//Start the server
//==============

app.listen(port, ip_address, function (){
console.log('Express is listening on ' + ip_address + ' at port' + port);
});

