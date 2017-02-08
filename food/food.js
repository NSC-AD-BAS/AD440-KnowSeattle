var yelpProvider = require('./yelpProvider');

function AreaSpecification(latitude, longitude, radius) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
}

function aggregateRatings(data) {
    var count = 0;
    var countByRating = data.reduce(function(aggregateStars, business) {
        var rating = business.rating.toString();
        count++;
        if(rating in aggregateStars) {
            aggregateStars[rating]++;
        }
        else {
            aggregateStars[rating] = 1;
        }
        return aggregateStars;
    },
    {});
    return countByRating;
}

function createUrl(areaSpecification) {
    var milesPerCoordinate = 0.01449;
	var gpsDelta = areaSpecification.radius * milesPerCoordinate / 1.25;
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

module.exports.getFoodData = function(latitude, longitude, radius, callback) {
    var areaSpecification = new AreaSpecification(latitude, longitude, radius);
    
    yelpProvider.find(areaSpecification, function(error, results) {
        if (error) {
            callback(error);
        }
        
        callback(null, {
            ratings: aggregateRatings(results),
            url: createUrl(areaSpecification)});
    });
}