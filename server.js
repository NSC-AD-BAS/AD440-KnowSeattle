var express = require('express');
var app = express();
var foodRouter = require("./routers/food/foodRouter")

var port = process.env.PORT;
var ip = process.env.IP

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/food/images', express.static('images/food'))
app.use('/food', foodRouter);
app.use('/', express.static('webroot'))
app.listen(port, ip);


console.log('Server running at http://' + ip + ':' + port);