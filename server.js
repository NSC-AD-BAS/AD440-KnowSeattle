#!/usr/bin/env node

var express = require('express');
var app = express();
var mainRouter = require('./routers');
var config = require('./serverConfig');
// cors-anywhere integration
var cors_proxy = require('cors-anywhere');
var cors_host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
var cors_port = 1111;

app.use('/', mainRouter);
app.listen(config.port, config.ip);
console.log('Server running at http://' + config.ip + ':' + config.port);

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(cors_port, cors_host, function() {
    console.log('Running CORS Anywhere on ' + cors_host + ':' + cors_port);
});
