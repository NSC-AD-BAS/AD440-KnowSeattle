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
// Function to get the Zindex for the selected neighborhood (summary page)
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
        // error handling for neighborhoods without zindex data
       if(data.includes("zindex")) {
         price = "$" + (data.split("<zindex currency=\"USD\">")[1]).split("</zindex>")[0];
       }
       else {
         price = "No data found";
       }
       response.send("<li>Neighborhood: " + neighborhood + "</li><li>Zindex: " + price + "</li>");
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
       // error handling for neighborhoods that don't have zindex data
       if(data.includes("zindex")) {
         price = "$" + (data.split("<zindex currency=\"USD\">")[1]).split("</zindex>")[0];
       }
       else {
         price = "No data found";
       }
       var link = data.split("<url>")[1] + regionid;
       handoff = "<div style='display: flex; flex-wrap: wrap'><div class='cell'>Neighborhood: " + neighborhood
        + "</div><div class='cell'>Zindex: " + price
        + "</div><div class='cell'>Link to Zillow: <a href='" + link + "'>" + link
        + "</a></div>"
		+ "<div id=\"propertymap\"></div>"
		+ "<script async defer"
        +   "src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyDStPouQGHiSJv3cbnFH8fctXX1OuBvKXw&callback=initPropertyMap&regionid=" + regionid + ">"
		+ "</script>"
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
      response.send(handoff + "<div class='cell'><img src='" + url + "' alt='Price Chart'></div></div>");
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}


var resultString = "";
var miles = true;
var infoWindow, geocoder;
var detailZoom = 13;
var zipSearch = 0;
var gmap;
var loc = {
   lat: 47.6062095,
   lng: -122.3320708,
   zip: null,
   rad: 1500,
   err: null,
   pid: null
};

//Mapping for the property details page
//Accepts polyCoords as the points of a polygon to draw
function initPropertyMap(var regionid) {
   //Initialize and center map

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
		   var query = { REGIONID: regionid }
		   collection.findOne(query, [], function(err, document) {
			 if(err || !document || !document.properties) {
			   res.send("<li>No data found</li>");
			   console.log("Query returned null");
			   return;
			 }
			var coodinates = document.geometry.ooordinates;
			
			//draw map using coordinates
			gmap = new google.maps.Map(document.getElementById('propertymap'), {
			  zoom: 10,
			  center: loc,
			  scroll: false
			});
			
			var polyCoords = [];
			
			for(count = 0; count < coordinates[0].length; count++) {
				polyCoords[count] = {lat: coordinates[0][count][0], lng: coordinates[0][count][1];
			}

			//Stand up the google services
			geocoder    = new google.maps.Geocoder();
			infoWindow  = new google.maps.InfoWindow({map: gmap});

			// Construct the polygon.
			var regionPoly = new google.maps.Polygon({
				paths: polyCoords,
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35
			});
			regionPoly.setMap(map);

		   //Handle click zooming and scrolling
		   google.maps.event.addListener(gmap, 'click', function( event ){
			  loc.lat = event.latLng.lat();
			  loc.lng = event.latLng.lng();
			  loc.err = null;
			  loc.pid = null;
			  loc.zip = null;

			  if (event.placeId) {
				 loc.pid = event.placeId;
				 getLocationFromPlaceId(loc.pid, gmap);
			  } else {
				 reverseGeocodeAddress(geocoder, gmap, loc);
			  }
			  // Enable scrolling zoom when map is in focus
			  this.setOptions({scrollwheel:true});
		   });

		   //Disable map scrollwheel when not selected
		   google.maps.event.addListener(gmap, 'mouseout', function(event){
			  this.setOptions({scrollwheel:false});
		   });
			
		   })

	   });
	   db.close();

		});
   
	};
}

function getLocationFromPlaceId(placeId, gmap) {
   var service = new google.maps.places.PlacesService(gmap);
   service.getDetails({ placeId: placeId }, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
         loc.err = "Failed to reverse Geocode location";
         console.error(status);
      } else {
         var arr = result.address_components;
         loc.err = null;
         loc.zip = null;
         loc.lat = result.geometry.location.lat();
         loc.lng = result.geometry.location.lng();
         getZip(arr, loc);
         updateDOM(gmap, loc);
      }
   });
}



function geocodeUserInput(geocoder, gmap) {
   var address = document.getElementById('address').value;
   //TODO: Slider for radius, tickbox for meters/miles
   geocoder.geocode({'address': address, 'componentRestrictions': {'locality': 'Seattle'}}, function(results, status) {
      if (status === 'OK') {
         var lat2, lon2;
         loc.err = null;
         loc.lat = results[0].geometry.location.lat();
         loc.lng = results[0].geometry.location.lng();
         getZip(results[0], loc);
         if (results[0].geometry.bounds) {
            lat2 = results[0].geometry.bounds.f.b;
            lon2 = results[0].geometry.bounds.b.b;
            loc.rad = getRadius(loc.lat, loc.lng, lat2, lon2, miles);
         }
         if (results[0].place_id) {
            getLocationFromPlaceId(results[0].place_id, gmap);
         } else if (neighborhood != null) {
            reverseGeocodeAddress(geocoder, loc);
         }
      } else {
         loc.err = "Sorry, No Results";
      }
      updateDOM(gmap, loc);
   });
}

function getZip(obj, loc) {
   for (var i = obj.length - 1; i >= 0; i--) {
      var isValid = /^[0-9]{5}(?:-[0-9]{4})?$/.test(obj[i].short_name);
      if (isValid) {
         loc.zip = parseInt(obj[i].short_name);
         return;
      }
   }
   loc.err = "Could not get zipcode for address";
   console.error("No zip for latlong");
}

function reverseGeocodeAddress(geocoder, gmap, loc) {
   if (!loc.lat || !loc.lng) {
      console.error("Location object lacked a latitude or longitude.");
   } else {
      var latlng = {lat: loc.lat, lng: loc.lng};
      geocoder.geocode({'location': latlng}, function(results, status) {
         if (status === 'OK') {
            loc.err = null;
            if (results[0]) {
               getZip(results[0].address_components, loc);
            } else {
               loc.err = "No results from reverseGeocodeAddress";
            }
         } else {
            loc.err = 'Geocoder failed due to: ' + status;
         }
         updateDOM(gmap, loc);
      });
   }
}

function updateDOM(gmap, loc) {
   if (loc.err != null) {
      resultString = loc.err;
   } else {
      infoWindow.setPosition(loc);
      infoWindow.setContent(resultString);

      //TODO:
      // if formatted_address, set us up the bomb.
      // infowindow.setContent(results[1].formatted_address);
      // infowindow.open(map, marker);

      gmap.setCenter({lat: loc.lat, lng: loc.lng});
      gmap.setZoom(detailZoom);
      resultString = "latitude: " + loc.lat + "<br>longitude: " + loc.lng + "<br>radius: " + loc.rad;
      if (loc.zip) {
         resultString += "<br>zip: " + loc.zip;
      }
      infoWindow.setContent(resultString);
   }
   render_page(currentPage);
}

function get_gmap() {
    if (gmap) {
        return gmap;
    } else {
        console.log("No Google Map object found");
        return null;
    }
}

function getRadius(lat1, lon1, lat2, lon2, miles) {
   var R = 6371e3; // metres
   var φ1 = toRadians(lat1);
   var φ2 = toRadians(lat2);
   var Δφ = toRadians(lat2-lat1);
   var Δλ = toRadians(lon2-lon1);

   var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ/2) * Math.sin(Δλ/2);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

   if (miles) {
      return Math.round(R * c * 0.000621371);
   } else {
      return Math.round(R * c);
   }
}

function toRadians(coord) {
   return coord * Math.PI / 180;
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
