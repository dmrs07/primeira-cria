var http = require('http');
var app  = require('./config/express')(app);

http.createServer(app).listen(process.env.PORT || 5000);
