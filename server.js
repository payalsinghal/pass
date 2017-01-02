var express = require('express');
var app = express();
var PORT=3000;
var bodyParser = require('body-parser');
var jsonparser = require('json-parser');
var mongoose = require('mongoose');
var passport = require('passport'); 
var flash    = require('connect-flash');
var morgan  = require('morgan')

mongoose.connect('mongodb://localhost/pbm');

app.use(morgan('dev')); 

app.use(passport.initialize());

app.use(flash());
var routes = require('./Routes/routes');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use('/api', routes)

app.listen(PORT,function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Server started at : '+PORT);
	}
});
