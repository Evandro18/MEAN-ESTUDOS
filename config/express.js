var express = require('express');
//var home = require('../app/routes/home');
var load = require('express-load');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
helmet = require('helmet');

module.exports = function(){
    var app = express();

    //variável de ambiente
    app.set('port', 3000);

    //middleware
    app.use(express.static('./public'));
	app.use(cookieParser());
	app.use(session({
		secret: 'homem avestruz',
		resave: true,
		saveUninitialized: true
	}));

	app.use(passport.initialize());
	
	//helmet
	app.use(helmet.frameguard());
	app.use(helmet.xssFilter());
	app.use(helmet.noSniff());
	app.disable('x-powered-by');

	app.use(passport.session());

	app.set('view engine', 'ejs');
	app.set('views', './app/views');


	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(require('method-override')());

	load('models', {cwd: 'app'})
		.then('controllers')
		.then('routes')
		.into(app);
	
	app.get('*', function(req, res) {
		res.status(404).render('404');
	});

    return app;
};
