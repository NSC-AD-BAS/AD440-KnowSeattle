module.exports.create = function(areaSpecification) {
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
};