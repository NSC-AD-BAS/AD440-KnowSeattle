/* This function is used when an address is not provided by the user
  and will instead use the latitude and longitude from the device position.
  It will provide the neighborhood ID and name from the Zillow database.
  Author: Austin Amort, Sai Chang */

var express = require('express');
var eyes = require('eyes');
var http = require('http');
var https = require('https');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

// Establish route for node.js
var router = express.Router();

router.route('/summary').get(function(req, res) {
    // collect the location from the URL
    console.log(req.query);
    var latitude = Number(req.query.lat);
    var longitude = Number(req.query.long);

    var loc = {
        lng: longitude,
        lat: latitude
    };

    getNeighborhood(loc, res);
});

var id = 1;
/*
Sample location object used for testing locally
var loc = {
  lng:"-122.364312",
  lat:"47.688395",
  addr:"620 NW 82nd St"
};
*/

/* getNeighborhood is used to retrieve the regionId from the DB
  it takes a callback argument for gethousingprices so that it waits until
  the query resolves before trying to use gethousingprices */
function getNeighborhood(location, res) {
  // Connect to the db
   var long = location.lng, lat = location.lat;
   MongoClient.connect("mongodb://localhost:27017/knowSeattle", function (err, db) {
       if(err) {
           throw err;
       }
       db.collection('neighborhoods', function (err, collection) {
           if(err) {
               throw err;
           }
           var query = { geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ long, lat ] } } } }
           collection.findOne(query, [], function(err, document) {
             if(err) {
               throw err;
             }
             // This line calls gethousingprices, note that we are inside the query callback
             gethousingprices(document.properties.REGIONID, res);
           })

       });

   });


}

function gethousingprices(regionid, response) {

   var options = {
      host: 'www.zillow.com',
      port: 80,
      path: '/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19eifb82423_85kuc&state=wa&city=seattle&childtype=neighborhood',
      method: 'GET'
   };

   var data = "", price = "";

   http.get(options, function(res) {
      res.on('data', function(dataresponse) { data += dataresponse.toString(); });
      res.on('end', function() {
         //console.log('data', data);
         //parser.parseString(data, function(err, result) {
         //	console.log('FINISHED', err, result);
         //});
        data = data.split(regionid)[1];
         var neighborhood =(data.split("<name>")[1]).split("</name>")[0];

         price = (data.split("<zindex currency=\"USD\">")[1]).split("</zindex>")[0];
         //console.log("The housing costs for the " + neighborhood + " neighborhood is: " + price);
        response.send("<li>Neighborhood: " + neighborhood + "</li><li>Zindex: " + price + "</li>");
         //return price;
      });
   }).on('error', function(e) {
      console.log("Got error: " + e.message);
   });
}

module.exports = router;
