var http = require('http');
var app  = require('./config/express')(app);

http.createServer(app).listen(app.get('port'));