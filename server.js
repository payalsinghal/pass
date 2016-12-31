var express = require('express');
var app = express();
var PORT=3000;
var bodyParser = require('body-parser');
var jsonparser = require('json-parser');
var mongoose = require('mongoose');
var passport = require('passport'); 
var flash    = require('connect-flash');
var session      = require('express-session');

mongoose.connect('mongodb://localhost/pbm');
//mongoose.connect('mongodb://52.66.15.53:27017/pickmybox');

app.use(session({ secret: 'passport' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
var routes = require('./Routes/routes');
//app.use(express.static(__dirname));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use('/api', routes)
//

// app.use(express.static(__dirname + '/public'));
// app.use(function(req, res) {
//    res.sendFile(__dirname + '/public/index.html');
// });

//require('./Routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.listen(PORT,function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Server started at : '+PORT);
	}
});
