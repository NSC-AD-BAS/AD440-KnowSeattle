var yelpProvider = require('./yelpProvider');
var ratingsAggregator = require('./ratingsAggregator');
var urlBuilder = require('./urlBuilder');

function AreaSpecification(latitude, longitude, radius) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
}

function getFoodData(latitude, longitude, radius, callback) {
    var areaSpecification = new AreaSpecification(latitude, longitude, radius);
    
    yelpProvider.find(areaSpecification, function(error, results) {
        if (error) {
            callback(error);
        }
        
        callback(null, {
            ratings: ratingsAggregator.aggregate(results),
            url: urlBuilder.create(areaSpecification)});
    });
}

module.exports.getFoodData = getFoodData;

//Example usage
getFoodData(47.51, -122.25, 3, function(error, data) {
    if(error) {
        console.log('Error:\n' + error);
    }
    else {
        console.log(data);
    }
});