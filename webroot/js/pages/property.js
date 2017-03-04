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
// function to redirect navigation to the appropriate Zillow page
function getPropertyData(loc, success, error) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
        //success(this.responseText);
        if(this.responseText == "<li>No data found</li>") {
          success("<li>No data found</li>")
        }
        else {
          window.location.replace(xhttp.responseText);
        }
    }
    else {
        error("<li>No data found</li>");
    }
  };
  console.log("Link clicked!");
  var url = "property/link?lat=" + loc.lat + "&long=" + loc.lng;
  xhttp.open("GET", url, true);
  xhttp.send();
  console.log("Url " + xhttp.responseText);

  //window.location.replace("http://www.zillow.com");
}
