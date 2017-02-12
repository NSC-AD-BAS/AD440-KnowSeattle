#!/usr/bin/env node

var express = require('express');
var app = express();
var food = require('./routers/food');
var corsRouter = require('./routers/corsHelper');
var propertyRouter = require('./routers/property/property');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/food', food);
app.use('/cors_helper', corsRouter);
app.use('/property', propertyRouter);
app.use('/', express.static('webroot'))

var config = require('./serverConfig');
app.listen(config.port, config.ip);

console.log('Server running at http://' + config.ip + ':' + config.port);
