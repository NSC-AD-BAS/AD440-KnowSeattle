/* 
 * Gets a address and prefills a lat long value needed
 * 
 * @author Samuel No
 */

/* global type */

function getCultureData(loc) {
   //  var loc = { passing this in from the main index.html / geocode.js now };
   $.ajax({
      url: "https://data.seattle.gov/resource/3c4b-gdxv.json?$$app_token=IZLnwcjjGNvFpmxfooid8p5VI",
      type: "GET",
      data: {
         "$limit": 10000,
         "$where": "within_circle(location, " + loc.lat + ", " + loc.lng + ", " +
         1500 + ")AND(city_feature = 'Heritage Trees' " +
         "OR city_feature = 'Viewpoints' OR city_feature = 'Museums and Galleries' " +
         "OR city_feature = 'General Attractions' OR city_feature = 'Waterfront' " +
         "OR city_feature = 'Public Art' OR city_feature = 'Libraries')"
      }
   }).done(function (data) {
      parseCityFeatures(data);
   });
}
function parseCityFeatures(data) {
   var typeMap = {};
   var dataMap = [];
   for (var i = 0; i < data.length; i++) {
      //string of events saved here
      var dat = data[i]["city_feature"];
      //counting the number of times a String appears
      if (dat !== null) {
         if (typeMap[dat]) {
            typeMap[dat]++;
            dataMap.push(data[i]);
         } else {
            typeMap[dat] = 1;
            dataMap.push(data[i]);
         }
      }
   }
   displayCultureData(dataMap);
}

function displayCultureData(typeMap) {
   var content = "<table><tr><th>Name</th><th>Address</th><th>City Feature</th><th>Website</th></tr>";
   for (var i = 0; i < typeMap.length; i++) {
      if (typeMap[i] !== null) {
         console.log(typeMap[i]);
         var name = typeMap[i].common_name == null ? "" : typeMap[i].common_name;
         var address = typeMap[i].address == null ? "" : typeMap[i].address;
         var city_feature = typeMap[i].city_feature == null ? "" : typeMap[i].city_feature;
         var website = typeMap[i].website == null ? "" : typeMap[i].website;
         content += '<tr><td>' +
            name + '</td><td>' +
            address + '</td><td>' +
            city_feature + '</td><td>' +
            website + '</td></tr>';
      }
   }
   content += "</table>";
   document.getElementById("left-content").innerHTML = content;
}
