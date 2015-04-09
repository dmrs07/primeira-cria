var express 		  	  = require('express');
//var multer  					= require('multer');

var mysql  			  	  = require('mysql');
var connection  	    = require('express-myconnection');
var load 			  		  = require('express-load');

var bodyParser        = require('body-parser');
var cookieParser      = require('cookie-parser');
var session           = require('express-session');
var passport          = require('passport');
var FacebookStrategy  = require('passport-facebook').Strategy;
var GoogleStrategy		= require('passport-google').Strategy;
var config            = require('./config');

module.exports = function() {
	var app = express();

	app.use(
		connection(mysql,{
			host: 'us-cdbr-iron-east-02.cleardb.net',
			user: 'b2956ade07b0e9',
			password : '4b1ef74e',
			port : 3306,
			database:'heroku_ab88ec5d5a28d45'
		}, 'request')
	);

	// configuração de ambiente
	//app.set('port', 3000);
	app.set('views', 'app/views');
	app.set('view engine', 'ejs');
	app.use(express.static('./public'));

	// middlewares
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	//app.use(multer({ dest: './uploads/'}));
	app.use(session(
		{ 	secret: 'homem paraquedas',
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
		host: 'us-cdbr-iron-east-02.cleardb.net',
		user: 'b2956ade07b0e9',
		password : '4b1ef74e',
		port : 3306,
		database:'heroku_ab88ec5d5a28d45'
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
			host: 'us-cdbr-iron-east-02.cleardb.net',
			user: 'b2956ade07b0e9',
			password : '4b1ef74e',
			port : 3306,
			database:'heroku_ab88ec5d5a28d45'
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

//Estratégia de Autenticação - Google+

passport.use(new GoogleStrategy({
    returnURL: 'http://protected-ridge-1670.herokuapp.com/auth/google/return',
    realm: 'http://protected-ridge-1670.herokuapp.com/'
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));

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

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/return',
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login'
}),
function(req, res) {
	res.redirect('/');
});

// Página inicial
app.get('/', function(req, res) {
	res.render('index.ejs', {
		user : req.user // get the user out of session and pass to template
	});
});

// Retorna pro AngularJS o usuário logado
app.get('/user', function(req, res) {
	res.json(req.user);
});

// Mata session
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// Carregamento automatico de dependencias
load('models', {cwd: 'app'})
.then('controllers')
.then('routes')
.into(app);

return app;
};
