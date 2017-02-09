/* This function is used when an address is not provided by the user
  and will instead use the latitude and longitude from the device position.
  It will provide the neighborhood ID and name from the Zillow database.
  Author: Austin Amort, Sai Chang */

var eyes = require('eyes');
var http = require('http');
var https = require('https');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

// Sample location object used for testing locally
var loc = {
  lng:"-122.364312",
  lat:"47.688395",
  addr:"620 NW 82nd St"
};

var id = documentid;

/* getNeighborhood is used to retrieve the regionId from the DB
  it takes a callback argument for gethousingprices so that it waits until
  the query resolves before trying to use gethousingprices */
function getNeighborhood(location, callback) {
  // Connect to the db
   var long = location.lng, lat = location.lat;
   MongoClient.connect("mongodb://localhost:27017/knowSeattle", function (err, db) {
       db.collection('neighborhoods', function (err, collection) {
           var query = { geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ long, lat ] } } } }
           collection.findOne(query, [], function(err, document) {
             if(err) {
               throw err;
             }
             // This line calls gethousingprices, note that we are inside the query callback
             callback(return document.properties.REGIONID, id);
           })

       });

   });
}

function gethousingprices(regionid, id) {
   var newstreet = street.replace(/ /g, '+');

   var options = {
      host: 'www.zillow.com',
      port: 80,
      path: '/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19eifb82423_85kuc&regionId=' + regionid + '&state=wa&city=seattle&childtype=neighborhood',
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

         var neighborhood =(data.split("<region name=\"")[1]).split("\" id=")[0];

         price = (data.split("<zindexValue>")[1]).split("</zindexValue>")[0];
         //console.log("The housing costs for the " + neighborhood + " neighborhood is: " + price);
         document.getElementById(id).innerHTML = ("The housing costs for the " + neighborhood + " neighborhood is: " + price);
         //return price;
      });
   }).on('error', function(e) {
      console.log("Got error: " + e.message);
   });
}

module.exports.getRegion = getNeighborhood;
