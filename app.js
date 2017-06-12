//setup basic express server
var express = require('express')
var app = require('express')();
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var http = require('http').Server(app);
var path = require('path');
var port = process.env.PORT || 3000;
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database
http.listen(port,function(){
	console.log("Listening",http.address().port);
});
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('view options', {
    layout: false
});
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

require('./config/passport.js')(passport);

// required for passport
app.use(session({ secret: 'abhigyanandlakshaycmd' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//routes
require('./serve/routes.js')(app, passport);

app.use(function(err,req,res,next){
	console.log(err.stack);
	res.status(500);
});