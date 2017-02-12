var express = require('express');
var app = express();
var food = require('./routers/food');
var corsRouter = require('./routers/corsHelper');

var port = process.env.PORT;
var ip = process.env.IP

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/food', food);
app.use('/cors_helper', corsRouter);
app.use('/', express.static('webroot'))
app.listen(port, ip);


console.log('Server running at http://' + ip + ':' + port);