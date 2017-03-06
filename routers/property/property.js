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
    var latitude = Number(req.query.lat);
    var longitude = Number(req.query.long);

    var loc = {
        lng: longitude,
        lat: latitude
    };

    callGetHousingPrices(loc, res);
});

router.route('/link').get(function(req, res) {
  var latitude = Number(req.query.lat);
  var longitude = Number(req.query.long);

  var loc = {
      lng: longitude,
      lat: latitude
  };

  callPageLink(loc, res);
})

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
function getNeighborhood(location, res, target) {
  // Connect to the db
   var long = location.lng, lat = location.lat;
   MongoClient.connect("mongodb://localhost:27017/knowSeattle", function (err, db) {
       if(err) {
           res.send("<li>No data found</li>");
           console.log("Unable to connect to MongoDB");
           return;
       }
       db.collection('neighborhoods', function (err, collection) {
           if(err) {
               res.send("<li>No data found</li>");
               console.log("Unable to find collection");
               return;
           }
           var query = { geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ long, lat ] } } } }
           collection.findOne(query, [], function(err, document) {
             if(err || !document || !document.properties) {
               res.send("<li>No data found</li>");
               console.log("Query returned null");
               return;
             }
             // This line calls gethousingprices, note that we are inside the query callback
             console.log(target);
            target(document.properties.REGIONID, res);
           })

       });
       db.close();

   });


}

function callGetHousingPrices(loc, res) {
  console.log("before function call");
  getNeighborhood(loc, res, gethousingprices);
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

function callPageLink(location, res) {
  // Connect to the db
   var long = location.lng, lat = location.lat;
   MongoClient.connect("mongodb://localhost:27017/knowSeattle", function (err, db) {
       if(err) {
           res.send("<li>No data found</li>");
           console.log("Unable to connect to MongoDB");
           return;
       }
       db.collection('neighborhoods', function (err, collection) {
           if(err) {
               res.send("<li>No data found</li>");
               console.log("Unable to find collection");
               return;
           }
           var query = { geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ long, lat ] } } } }
           collection.findOne(query, [], function(err, document) {
             if(err || !document || !document.properties) {
               res.send("<li>No data found</li>");
               console.log("Query returned null");
               return;
             }
             // This line calls gethousingprices, note that we are inside the query callback
            getPageLink(document.properties.REGIONID, res);
           })

       });
       db.close();

   });
 }

function getPageLink(regionid, response) {
  var options = {
     host: 'www.zillow.com',
     port: 80,
     path: '/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19eifb82423_85kuc&state=wa&city=seattle&childtype=neighborhood',
     method: 'GET'
  };

  var data = "";

  http.get(options, function(res) {
     res.on('data', function(dataresponse) { data += dataresponse.toString(); });
     res.on('end', function() {
       data = data.split(regionid)[1];
        var pageLink =(data.split("<url>")[1]).split("</url>")[0];
        console.log(pageLink);
        //console.log("The housing costs for the " + neighborhood + " neighborhood is: " + price);
       response.send(pageLink + regionid);
        //return price;
     });
  }).on('error', function(e) {
     console.log("Got error: " + e.message);
  });
}

module.exports = router;
