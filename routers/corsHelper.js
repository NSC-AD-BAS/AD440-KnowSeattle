var express = require('express');
var request = require('request');

function walkscore(req, res) {
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
            var jsonResult = body;
            res.send(jsonResult);
        }
    });
}

function concerts(req, res) {
    var zipcode = req.query.loc.zip;
    var key = "k5dywsuqf9vaexvg5xczcspf";
    var url = "http://api.jambase.com/events?zipCode="
        + zipcode
        + "&radius=0&page=0&api_key="
        + key;
        
    if (!zipcode || zipcode.length != 5) {
        res.status(500);
        res.send("Error: bad zipcode");
        return;
    }

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            console.log(response);
            res.status(500);
            res.send("Error retrieving concert data!");
        }
    });
}
    
var corsFunctions = {walkscore: walkscore, concerts: concerts};

var router = express.Router();
router.route('/')
    .get(function(req, res) {
        console.log(req.query);
        var functionName = req.query.f;
        if (functionName in corsFunctions) {
            console.log("Found function!");
            corsFunctions[functionName](req, res);
        }
            
    });

module.exports = router;