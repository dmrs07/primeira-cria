var express 		  	  = require('express');
var mysql  			  	  = require('mysql');
var connection  	    = require('express-myconnection');
var load 			  		  = require('express-load');

var bodyParser        = require('body-parser');
var cookieParser      = require('cookie-parser');
var session           = require('express-session');
var passport          = require('passport');
var FacebookStrategy  = require('passport-facebook').Strategy;
var config            = require('./config');

module.exports = function() {
	var app = express();

	app.use(
		connection(mysql,{
			host: 'localhost',
			user: 'root',
			password : '',
			port : 3306,
			database:'lojinha'
		}, 'request')
	);

	// configuração de ambiente
	app.set('port', 3000);
	app.set('views', 'app/views');
	app.set('view engine', 'ejs');
	app.use(express.static('./public'));

	// middlewares
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(session(
		{ 	secret: 'homem avestruz',
		resave: true,
		saveUninitialized: true
	}
));
app.use(passport.initialize());
app.use(passport.session());

// Session setup
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(user, done) {
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
		port : 3306,
		database:'lojinha'
	});

	connection.query("SELECT * FROM usuarios WHERE id = " + user, function(err, rows) {
		if (rows.length) {
			var user = rows[0];

			done(null, rows[0]);
		}

	});
});

// Estratégia de autenticação - Facebook
passport.use(new FacebookStrategy({
	clientID: 	  config.facebook_api_key,
	clientSecret: config.facebook_api_secret ,
	callbackURL:  config.callback_url

}, function(accessToken, refreshToken, profile, done) {
	process.nextTick(function() {

		var connection = mysql.createConnection({
			host : 'localhost',
			user : 'root',
			password : '',
			port : 3306,
			database:'lojinha'
		});

		connection.query("SELECT * FROM usuarios WHERE id = " + profile.id, function(err, rows) {

			if (rows.length) { // Usuário existe
				var user = rows[0];

				return done(null, user);

			} else {
				var insertQuery = "INSERT INTO usuarios ( id, nome, email ) values ('" + profile.id +"', '"+ profile.name.givenName  +"', '" + profile.emails[0].value +"')";

				connection.query(insertQuery, function(err,rows) {
					var user = new Object();

					user.id = profile.id;
					user.nome = profile.name.givenName;
					user.email = profile.email;

					return done(null, user);
				});
			}

		});
	});

}));

// Passport Router
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_photos'] }));
app.get('/auth/facebook/callback',
passport.authenticate('facebook', {
	successRedirect : '/',
	failureRedirect: '/#/auth'
}),
function(req, res) {
	res.redirect('/');
});

app.get('/', function(req, res) {
	res.render('index.ejs', {
		user : req.user // get the user out of session and pass to template
	});
});

app.get('/user', function(req, res) {
	res.json(req.user);
});

app.get('/logout', function(req, res) {
	console.log('LOGOUT');
	req.logout();
	res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/#/auth')
}

// Carregamento automatico de dependencias
load('models', {cwd: 'app'})
.then('controllers')
.then('routes')
.into(app);

return app;
};
