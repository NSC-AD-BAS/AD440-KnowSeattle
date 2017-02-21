#!/usr/bin/env node

var express = require('express');
var app = express();
var mainRouter = require('./routers');
var config = require('./serverConfig');

app.use('/', mainRouter);
app.listen(config.port, config.ip);

console.log('Server running at http://' + config.ip + ':' + config.port);
