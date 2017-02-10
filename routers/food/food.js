var yelpProvider = require('./yelpProvider');

function AreaSpecification(latitude, longitude, radius) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
}

function calculateAverageRating(data) {
    var ratingSum = data.reduce(function(sum, business) {
        return sum + business.rating
    }, 0);
    return ratingSum / data.length;
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

function getNearestYelpRating(rating) {
    var yelpRating = Math.round(rating * 2) / 2;
    return yelpRating === 0.5 ? 0 : yelpRating;
}

var imageIndexesByRating = {
    0:   ['0','0','0','0','0'],
    1:   ['1','0','0','0','0'],
    1.5: ['1','1-5','0','0','0'],
    2:   ['2','2','0','0','0'],
    2.5: ['2','2','2-5','0','0'],
    3:   ['3','3','3','0','0'],
    3.5: ['3','3','3','3-5','0'],
    4:   ['4','4','4','4','0'],
    4.5: ['4','4','4','4','4-5'],
    5:   ['5','5','5','5','5']
};

function getImageNamesFor(rating) {
    return imageIndexesByRating[rating].map(function(imageIndex) { return "20x20_" + imageIndex + ".png"; })
}

module.exports.getFoodData = function(latitude, longitude, radius, callback) {
    var areaSpecification = new AreaSpecification(latitude, longitude, radius);
    
    yelpProvider.find(areaSpecification, function(error, results) {
        if (error) {
            callback(error);
        }
        
        var averageRating = calculateAverageRating(results);
        var nearestYelpRating = getNearestYelpRating(averageRating);
        var imageNames = getImageNamesFor(nearestYelpRating);
        
        callback(null, {
            ratingImages: imageNames,
            url: createUrl(areaSpecification),
            averageRating: nearestYelpRating,
            count: results.length
        });
    });
}