var express = require('express');
var food = require('./food')
var app = express();

var port = process.env.PORT;
var ip = process.env.IP

app.get('/food/summary', function(req, res) {
    var latitude = req.query.lat;
    var longitude = req.query.long;
    var radius = req.query.rad;
    
    console.log(req.query);
    
    food.getFoodData(latitude, longitude, radius, function(error, data) {
        if(error) {
            console.log('Error:\n');
            console.log(error);
        }
        else {
            console.log(data);
            res.writeHead(200 , {
                'Content-Type': 'text/html'
            });
            res.write(JSON.stringify(data));
            res.end();
        }
});
  
}).listen(port, ip);
console.log('Server running at http://' + ip + ':' + port);