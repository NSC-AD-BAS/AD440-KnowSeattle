var express = require('express');
var request = require('request');

var router = express.Router();
router.route('/walkscore')
    .get(function(req, res) {
        var latitude = req.query.loc.lat;
        var longitude = req.query.loc.lng;
        var key = '10284fa9f60a76d6175a7fb5d834ad20';
        
        var url = "http://api.walkscore.com/score?format=json&lat=" 
            + latitude 
            +"&lon=" 
            + longitude 
            + "&transit=1&bike=1&wsapikey=" 
            + key;

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
            var jsonResult = body;//JSON.parse(body);
            console.log(jsonResult);
            res.send(jsonResult);
        }
    })
});

module.exports = router;