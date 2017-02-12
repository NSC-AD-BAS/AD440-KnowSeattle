var express = require('express');
var app = express();
var food = require('./routers/food');
var corsRouter = require('./routers/corsHelper');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/food', food);
app.use('/cors_helper', corsRouter);
app.use('/', express.static('webroot'));

var config = require('./serverConfig');
app.listen.apply(app, config);

console.log('Server running at http://' + config[1] + ':' + config[0]);