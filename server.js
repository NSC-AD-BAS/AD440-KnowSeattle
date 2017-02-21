#!/usr/bin/env node

var express = require('express');
var app = express();
var mainRouter = require('./routers');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/', mainRouter);

var config = require('./serverConfig');
app.listen(config.port, config.ip);

console.log('Server running at http://' + config.ip + ':' + config.port);
