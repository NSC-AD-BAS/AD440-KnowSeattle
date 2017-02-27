var express = require('express');
var Yelp = require('yelp');
var credentials = {
	"consumer_key": "Ubno_SkDE5Q9mftmU8LV6w",
    "consumer_secret": "P6whm8VoDnD45OBipRNS-ONGgT8",
    "token": "JTYXlT3BycqjVayPs2HnGDfejH5gZ5FI",
    "token_secret": "GDBwiG2_fdESV5VjVhsKw5tvTIs"
}

var router = express.Router();
router.route('/summary')
    .get(function(req, res) {
        var areaSpecification = new AreaSpecification(
            Number(req.query.location.lat),
            Number(req.query.location.lng),
            Number(req.query.location.rad));
        
        getFoodData(areaSpecification, function(error, data) {
            if(error) {
                console.log(error);
                res.status(500)
                res.send('Error while retrieving yelp data.');
            }
            else {
                res.json(data);
            }
        });
});

function AreaSpecification(latitude, longitude, radius) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
}

function getFoodData(areaSpecification, callback) {
    find(areaSpecification, function(error, results) {
        if (error) {
            callback(error);
        }
        
        var averageRating = calculateAverageRating(results);
        var nearestHalfStar = calculateNearestHalfStar(averageRating);
        
        callback(null, {
            averageRating: nearestHalfStar,
            count: results.length,
            url: createUrl(areaSpecification)
        });
    });
}

function calculateAverageRating(data) {
    var ratingSum = data.reduce(function(sum, business) {
        return sum + business.rating
    }, 0);
    return ratingSum / data.length;
}

function calculateNearestHalfStar(rating) {
    var yelpRating = Math.round(rating * 2) / 2;
    return yelpRating === 0.5 ? 0 : yelpRating;
}

function createUrl(areaSpecification) {
    var coordinatesPerMile = 0.01449 / 1609;
	var gpsDelta = areaSpecification.radius * coordinatesPerMile / 1.25;
	var gpsBox = {
		southWestLatitude : areaSpecification.latitude - gpsDelta,
		southWestLongitude: areaSpecification.longitude - gpsDelta,
		northWestLatitude: areaSpecification.latitude + gpsDelta,
		northWestLongitude: areaSpecification.longitude + gpsDelta };
	
	return 'https://www.yelp.com/search?cflt=restaurants&start=0&l=g:' +
		gpsBox.southWestLongitude + ',' +
		gpsBox.southWestLatitude + ',' +
		gpsBox.northWestLongitude + ',' +
		gpsBox.northWestLatitude;
}

function find(areaSpecification, callback) {
    var yelp = new Yelp(credentials);
    var resultsPerCall = 40;
    var coordinates = areaSpecification.latitude + "," + areaSpecification.longitude;
    var radiusInMeters = areaSpecification.radius;
    
    function searchRecurrsive(offset, results) {
        yelp.search({ category_filter: 'restaurants', ll: coordinates, radius_filter: radiusInMeters, limit: resultsPerCall, offset: offset})
            .then(function (data) {
                var newResults = results.concat(data.businesses);
                var nextOffset = getNextOffset(data, offset);
                
                if (nextOffset) {
                    searchRecurrsive(nextOffset, newResults);
                }
                else {
                    callback(null, newResults);
                }    
            })
            .catch(callback);    
    }
    searchRecurrsive(0, []);        
}

function getNextOffset(data, offset) {
        var resultCount = data.businesses.length;
        var total = data.total;
        var nextOffset = offset + resultCount;
        if (nextOffset < total && nextOffset < 1000)
            return nextOffset;
}

module.exports = router;