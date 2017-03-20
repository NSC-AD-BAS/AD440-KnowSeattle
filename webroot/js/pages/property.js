/*
Client side script to call the property API
Author: Austin Amort
*/

function getPropertySummary(loc, success, error) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      success(this.responseText);
    }
    // else {
    //     error("<li>No data found</li>");
    // }
  };
  console.log("lat: " + loc.lat);
  console.log("long: " + loc.lng);
  var url = "property/summary?lat=" + loc.lat + "&long=" + loc.lng;
  xhttp.open("GET", url, true);
  xhttp.send();
}

// function to display the detail page on screen
function getPropertyData(loc, success, error) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      gmap.data.addGeoJson({"type":"Feature","properties":{"STATE":"WA","COUNTY":"King","CITY":"Seattle","NAME":"Westlake","REGIONID":272022},"geometry":{"type":"Polygon","coordinates":[[[-122.338620460052,47.6280391736402],
        [-122.33823329095,47.6267170377658],[-122.33823329095,47.6281982018298],[-122.337295220637,47.6283956901112],[-122.335912800714,47.6282969459705],[-122.335912800714,47.6268651549535],
        [-122.335904897872,47.625776807527],[-122.337825625251,47.6257467961617],[-122.339146125324,47.6255667279698],[-122.340076477648,47.6253566484129],[-122.34178712547,47.6249064779333],
        [-122.342627443699,47.6244863188192],[-122.343737305974,47.623741135239],[-122.34371779866,47.6245701922007],[-122.343588335525,47.6280083504299],[-122.343431789915,47.6324058589418],
        [-122.343460252753,47.6359494823056],[-122.343559872687,47.6362341106881],[-122.343773343974,47.6366183590047],[-122.344015278099,47.6369883759021],[-122.344285675063,47.6373726242187],
        [-122.345737279814,47.6393507914775],[-122.346363462256,47.6405604621037],[-122.346719247734,47.6415139671856],[-122.347075033212,47.6426667121352],[-122.347188884565,47.64307942329],
        [-122.34727427308,47.6435775229596],[-122.347316967338,47.6440471597909],[-122.347316967338,47.6449722020346],[-122.347315141085,47.646172054686],[-122.346976961671,47.646032118377],
        [-122.342419179234,47.6439197580381],[-122.341291434934,47.6423807187574],[-122.340415774653,47.6406161306165],[-122.339056853168,47.6379644301757],[-122.339159214085,47.6323290230731],[-122.33935752389,47.628739384286],[-122.338620460052,47.6280391736402]]]}});
      console.log(this.responseText);
        success(this.responseText);
    }
    else {
        error("Loading....");
    }
  };
  var url = "property/detail?lat=" + loc.lat + "&long=" + loc.lng;
  xhttp.open("GET", url, true);
  xhttp.send();
}

// function to ask the API for geometry data and add it to the map
function drawMapFeatures(loc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      gmap.data.addGeoJson(this.responseText);
    }
  };
  var url = "property/geo?lat=" + loc.lat + "&long=" + loc.lng;
  xhttp.open("GET", url, true);
  xhttp.send();
}
