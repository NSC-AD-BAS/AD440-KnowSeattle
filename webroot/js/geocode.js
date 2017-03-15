var resultString = "";
var miles = true;
var infoWindow, geocoder;
var detailZoom = 13;
var zipSearch = 0;
var gmap;
var geocode_markers = [];

var loc = {
   lat: 47.6062095,
   lng: -122.3320708,
   zip: null,
   rad: 1500,
   err: null,
   pid: null
};

function initMap() {
   //Initialize and center map

   gmap = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: loc,
      scroll: false
   });

   //Stand up the google services
   geocoder    = new google.maps.Geocoder();
   infoWindow  = new google.maps.InfoWindow({map: gmap});

   //Try to get the browser location
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
         loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            rad: 1500
         };
         reverseGeocodeAddress(geocoder, gmap, loc);
      });
   } else {
      console.error("Browser doesn't support Geolocation");
   }

   //Handle click events and maybe reverseGeocode the address
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
   //Address search bar, geocode button
   document.getElementById('submit').addEventListener('click', function() {
      geocodeUserInput(geocoder, gmap);
   });
   document.getElementById('submitMobile').addEventListener('click', function() {
      geocodeUserInput(geocoder, gmap);
   });
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
   if(mediaQuery()){
      var address = document.getElementById('address').value; // get the value from the main search input
   }else{
      var address = document.getElementById('addressMobile').value; // get the value from the mobile search input
   }

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

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
   for (var i = 0; i < geocode_markers.length; i++) {
      geocode_markers[i].setMap(null);
   }
}
