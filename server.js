var express = require('express');
var food = require('./food/food')
var app = express();

var port = process.env.PORT;
var ip = process.env.IP

app.set('views', './views/food');
app.set('view engine', 'ejs');
app.use('/food/images',express.static('images/food'))

// Example: http://know-seattle-nlflint.c9users.io/food/summary?lat=47.51&long=-122.25&rad=3
app.get('/food/summary', function(req, res) {
    var latitude = Number(req.query.lat);
    var longitude = Number(req.query.long);
    var radius = Number(req.query.rad);
    
    food.getFoodData(latitude, longitude, radius, function(error, data) {
        if(error) {
            console.log(error);
            res.status(500)
            res.render('error');
        }
        else {
            res.render('summary', data);
        }
});
  
}).listen(port, ip);
console.log('Server running at http://' + ip + ':' + port);