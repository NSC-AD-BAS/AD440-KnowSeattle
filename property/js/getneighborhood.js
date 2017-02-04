/* This function is used when an address is not provided by the user
  and will instead use the latitude and longitude from the device position.
  It will provide the neighborhood ID and name from the Zillow database.
  Author: Austin Amort */

/*var eyes = require('eyes');
var http = require('http');
var https = require('https');
var fs = require('fs');*/
var MongoClient = require('mongodb').MongoClient;
//var xml2js = require('xml2js');
//var parser = new xml2js.Parser();
// sample values for location, replace this with the global variable from Jeremy
var longitude =  -122.363045;
var latitude = 47.685807;


getneighborhood(longitude, latitude);

function getneighborhood(long, lat) {
  // Connect to the db
MongoClient.connect("mongodb://localhost:27017/knowSeattle", function (err, db) {
    db.collection('neighborhoods', function (err, collection) {
        var query = { geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ long, lat ] } } } }
        collection.findOne(query, [], function(err, document) {
          if(err) {
            throw err;
          }
          console.log(document.properties.REGIONID);
        })

    });

});
}
