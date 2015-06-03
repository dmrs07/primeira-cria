var express 		  	  = require('express');
var multer  					= require('multer');

var mysql  			  	  = require('mysql');
var connection  	    = require('express-myconnection');
var load 			  		  = require('express-load');

var bodyParser        = require('body-parser');
var cookieParser      = require('cookie-parser');
var session           = require('express-session');
var passport          = require('passport');
var FacebookStrategy  = require('passport-facebook').Strategy;
var GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy;
var configFacebook    = require('./config-facebook');
var configGoogle      = require('./config-google');
var done              = false;

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
	app.set('views', 'app/views');
	app.set('view engine', 'ejs');
	app.use(express.static('./public'));

	// middlewares
	app.use(cookieParser());
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

	// config multer upload
	app.use(multer({ dest: './uploads/',
		rename: function (fieldname, filename) {
			return filename + Date.now();
		},
		onFileUploadStart: function (file) {
			console.log(file.originalname + ' is starting ...')
		},
		onFileUploadComplete: function (file) {
			console.log(file.fieldname + ' uploaded to  ' + file.path)
			done=true;
		},
		inMemory: true
	}));

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

	connection.end();
});

// Estratégia de autenticação - Facebook
passport.use(new FacebookStrategy({
	clientID: 	  configFacebook.FACEBOOK_API_KEY,
	clientSecret: configFacebook.FACEBOOK_API_SECRET,
	callbackURL:  configFacebook.CALLBACK_URL

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
			if(rows) {

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
			}
		});

		connection.end();

	});

}));

//Estratégia de Autenticação - Google+
passport.use(new GoogleStrategy({
    clientID: 		configGoogle.GOOGLE_CLIENT_ID,
    clientSecret: configGoogle.GOOGLE_CLIENT_SECRET,
    callbackURL:  configGoogle.GOOGLE_CALLBACK_URL

  }, function(accessToken, refreshToken, profile, done) {
		alert('test');
		process.nextTick(function() {

			// To keep the example simple, the user's Google profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the Google account with a user record in your database,
			// and return that user instead.

			var connection = mysql.createConnection({
				host: 'us-cdbr-iron-east-02.cleardb.net',
				user: 'b2956ade07b0e9',
				password : '4b1ef74e',
				port : 3306,
				database:'heroku_ab88ec5d5a28d45'
			});

			connection.query("SELECT * FROM usuarios WHERE id = " + profile.id, function(err, rows) {
				if(rows) {

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

							return done(null, profile);
						});
					}
				}
			});

			connection.end();

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

app.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', {
	successRedirect : '/',
	failureRedirect: '/'
}),
  function(req, res) {
    // Successful authentication, redirect home.
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
