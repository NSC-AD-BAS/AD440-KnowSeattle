var fs = require('fs');
var Yelp = require('yelp');

var credentials = JSON.parse(fs.readFileSync(__dirname + '/yelp_secrets.json', 'utf8'));
var yelp = new Yelp(credentials);
var resultsPerCall = 40;

function getNextOffset(data, offset) {
        var resultCount = data.businesses.length;
        var total = data.total;
        var nextOffset = offset + resultCount;
        if (nextOffset < total && nextOffset < 1000)
            return nextOffset;
}

module.exports.find = function(areaSpecification, callback) {
    var coordinates = areaSpecification.latitude + "," + areaSpecification.longitude;
    var radiusInMeters = areaSpecification.radius * 1609;
    
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
};


