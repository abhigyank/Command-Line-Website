//setup basic express server
var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var port = process.env.PORT || 3000;
var index = require('./serve/index.js');
http.listen(port,function(){
	console.log("Listening",http.address().port);
});
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('view options', {
    layout: false
});


app.use('/',index);
app.use(function(err,req,res,next){
	console.log(err.stack);
	res.status(500);
});