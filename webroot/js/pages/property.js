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
    else {
        error("<li>No data found</li>");
    }
  };
  console.log("lat: " + loc.lat);
  console.log("long: " + loc.lng);
  var url = "property/summary?lat=" + loc.lat + "&long=" + loc.lng;
  xhttp.open("GET", url, true);
  xhttp.send();
}
