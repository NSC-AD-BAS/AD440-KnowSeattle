var express = require('express');
var food = require('./food');

var router = express.Router();
router.route('/summary')
    .get(function(req, res) {
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
                res.render('food/summary', data);
            }
        });
});
router.route('/food/images', express.static('images/food'));

module.exports = router;