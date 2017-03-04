var express = require('express');
var food = require('./food');
var corsRouter = require('./corsHelper');
var propertyRouter = require('./property/property');

var mainRouter = express.Router();
mainRouter.use('/food', food);
mainRouter.use('/php/cors_helper.php', corsRouter);
mainRouter.use('/property', propertyRouter);
mainRouter.use('/', express.static('webroot'))

module.exports = mainRouter;