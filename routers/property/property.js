/* Serverside backend node.js code for displaing the property data
  to the client page.
  Author: Austin Amort, Sai Chang */

var express = require('express');
var eyes = require('eyes');
var http = require('http');
var https = require('https');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

// Establish route for node.js
var router = express.Router();

// API endpoint for summary data
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

// API endpoint for detail page
router.route('/detail').get(function(req, res) {
  var latitude = Number(req.query.lat);
  var longitude = Number(req.query.long);

  var loc = {
      lng: longitude,
      lat: latitude
  };

  callGetDetailData(loc, res);
})

// router.route('/link').get(function(req, res) {
//   var latitude = Number(req.query.lat);
//   var longitude = Number(req.query.long);
//
//   var loc = {
//       lng: longitude,
//       lat: latitude
//   };
//
//   callPageLink(loc, res);
// })

/* getNeighborhood is used to retrieve the regionId from the DB
  it takes a function that is called to pass the regionId to */
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
            target(document.properties.REGIONID, res);
           })

       });
       db.close();

   });


}
// Function to get the Zindex for the selected neighborhood
function callGetHousingPrices(loc, res) {
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
        response.send("<li>Neighborhood: " + neighborhood + "</li><li>Zindex: $" + price + "</li>");
      });
   }).on('error', function(e) {
      console.log("Got error: " + e.message);
   });
}

// function to get all of the detailed information about the neighborhood
function callGetDetailData(loc, res) {
  getNeighborhood(loc, res, getDetailData);
}

function getDetailData(regionid, response) {
  var options = {
     host: 'www.zillow.com',
     port: 80,
     path: '/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19eifb82423_85kuc&state=wa&city=seattle&childtype=neighborhood',
     method: 'GET'
  };

  var data = "", price = "", handoff = "";

  http.get(options, function(res) {
     res.on('data', function(dataresponse) { data += dataresponse.toString(); });
     res.on('end', function() {
       data = data.split(regionid)[1];
       var neighborhood =(data.split("<name>")[1]).split("</name>")[0];
       price = (data.split("<zindex currency=\"USD\">")[1]).split("</zindex>")[0];
       var link = data.split("<url>")[1] + regionid;
       handoff = "<div class='cell'>Neighborhood: " + neighborhood
        + "</div><div class='cell'>Zindex: $" + price
        + "</div><div class='cell'>Link to Zillow: <a href='" + link + "'>" + link
        + "</a></div>"
		+ "<footer class ='propertyfooter'>"
		+ "<img src=\"./assets/zillowlogo.png\" alt=\"Zillow Logo\" style=\"width:50px;height:50px;\">"
		+ "<a href=\"zillow.com\">"
		+ "powered by Zillow</a>"
		+ "</footer>";
        getChart(regionid, response, handoff);
     });
  }).on('error', function(e) {
     console.log("Got error: " + e.message);
  });
}

function getChart(regionid, response, handoff) {
  var options = {
     host: 'www.zillow.com',
     port: 80,
     path: '/webservice/GetRegionChart.htm?zws-id=X1-ZWz19eifb82423_85kuc&regionId=' + regionid + '&unit-type=dollar&width=350&height=200&chartDuration=5years',
     method: 'GET'
  };

  var data = "";

  http.get(options, function(res) {
    res.on('data', function(dataresponse) { data += dataresponse.toString(); });
    res.on('end', function() {
      var url = (data.split("<url>")[1]).split("</url>")[0];
      response.send(handoff + "<div class='cell'><img src='" + url + "' alt='Price Chart'></div>");
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}
// Deprecated code, old functionality for page redirect
// function callPageLink(location, res) {
//   // Connect to the db
//    var long = location.lng, lat = location.lat;
//    MongoClient.connect("mongodb://localhost:27017/knowSeattle", function (err, db) {
//        if(err) {
//            res.send("<li>No data found</li>");
//            console.log("Unable to connect to MongoDB");
//            return;
//        }
//        db.collection('neighborhoods', function (err, collection) {
//            if(err) {
//                res.send("<li>No data found</li>");
//                console.log("Unable to find collection");
//                return;
//            }
//            var query = { geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ long, lat ] } } } }
//            collection.findOne(query, [], function(err, document) {
//              if(err || !document || !document.properties) {
//                res.send("<li>No data found</li>");
//                console.log("Query returned null");
//                return;
//              }
//              // This line calls gethousingprices, note that we are inside the query callback
//             getPageLink(document.properties.REGIONID, res);
//            })
//
//        });
//        db.close();
//
//    });
//  }

// function getPageLink(regionid, response) {
//   var options = {
//      host: 'www.zillow.com',
//      port: 80,
//      path: '/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19eifb82423_85kuc&state=wa&city=seattle&childtype=neighborhood',
//      method: 'GET'
//   };
//
//   var data = "";
//
//   http.get(options, function(res) {
//      res.on('data', function(dataresponse) { data += dataresponse.toString(); });
//      res.on('end', function() {
//        data = data.split(regionid)[1];
//         var pageLink =(data.split("<url>")[1]).split("</url>")[0];
//         console.log(pageLink);
//         //console.log("The housing costs for the " + neighborhood + " neighborhood is: " + price);
//        response.send(pageLink + regionid);
//         //return price;
//      });
//   }).on('error', function(e) {
//      console.log("Got error: " + e.message);
//   });
// }

module.exports = router;
