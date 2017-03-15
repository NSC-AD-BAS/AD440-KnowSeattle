function getWalkScoreSummary(loc, success, error) {
   var key = "10284fa9f60a76d6175a7fb5d834ad20";      //TODO: This should be a node or mongo get query #Security
   var url = "http://api.walkscore.com/score?format=json&lat=" + loc.lat + "&lon=" + loc.lng + "&transit=1&bike=1&wsapikey=" + key;
   getCorsData({
      method: 'GET',
      url: url,
      data: ""
   }, function (data) {
      var json = JSON.parse(data);
      var summary = "<li>Walk: " + json.walkscore + "</li><li>Transit: " + json.transit.score + "</li><li>Bike: " + json.bike.score + "</li>";
      success(summary);
   }, function (data) {
      var summary = "Error getting WalkScore data.  ";
      console.error(summary + data);
      error(summary);
   });
}


function getWalkScoreData(loc, success, error) {
   var key = "10284fa9f60a76d6175a7fb5d834ad20";      //TODO: This should be a node or mongo get query #Security
   var url = "http://api.walkscore.com/score?format=json&lat=" + loc.lat + "&lon=" + loc.lng + "&transit=1&bike=1&wsapikey=" + key;
   getCorsData({
      method: 'GET',
      url: url,
      data: ""
   }, function (data) {
      var json = JSON.parse(data);
      var walk = walkPrint(json);
      var transit = transitPrint(json);
      var bike = bikePrint(json);
      success(walk+ "<br><br>" +transit+ "<br><br>" +bike);
   }, function (data) {
      var detail = "Error getting WalkScore data";
      console.error(detail);
      error(detail);
   });
}

function walkPrint(json) {
    if (json.walkscore > 50 ){
return ('<center><a target="_blank" href="' + json.help_link + '"><img src="/assets/1488632996_ic_directions_walk_48px.png""' + '" /><span class="walkscore-scoretext">' +
 "<br>Walker Score&reg;: " + '<div class="progress-circle over50 p'+json.walkscore+'"><span>'+json.walkscore+'</span><div class="left-half-clipper"><div class="first50-bar"></div><div class="value-bar"></div></div></div>'  + '</span></a>' + json.description+'</center>');
    }
    else if (json.walkscore < 51){
return ('<center><a target="_blank" href="' + json.help_link + '"><img src="/assets/1488632996_ic_directions_walk_48px.png""' + '" /><span class="walkscore-scoretext">' +
 "<br>Walker Score&reg;: " + '<div class="progress-circle p'+json.walkscore+'"><span>'+json.walkscore+'</span><div class="left-half-clipper"><div class="first50-bar"></div><div class="value-bar"></div></div></div>'  + '</span></a>' + json.description+'</center>');
    }

}
function transitPrint(json){
    if (json.transit.score > 50){
return ('<center><a target="_blank" href="' + json.help_link + '"><img src="/assets/1488634057_ic_directions_bus_48px.png""' +
 '" /><span class="walkscore-scoretext">' + "<br>Transit Score&reg;: " + '<div class="progress-circle over50 p'+json.transit.score+'"><span>'+json.transit.score+'</span><div class="left-half-clipper"><div class="first50-bar"></div><div class="value-bar"></div></div></div>' + '</span></a>' + json.transit.description +" <br>" + json.transit.summary+'</center>');
    }
   else if (json.transit.score < 51){
return ('<center><a target="_blank" href="' + json.help_link + '"><img src="/assets/1488634057_ic_directions_bus_48px.png""' +
 '" /><span class="walkscore-scoretext">' + "<br>Transit Score&reg;: " + '<div class="progress-circle p'+json.transit.score+'"><span>'+json.transit.score+'</span><div class="left-half-clipper"><div class="first50-bar"></div><div class="value-bar"></div></div></div>' + '</span></a>' + json.transit.description +" <br>" + json.transit.summary+'</center>');
    }
}
function bikePrint(json){
    if (json.bike.score > 50){
return('<center><a target="_blank" href="' + json.help_link + '"><img src="/assets/1488635917_ic_directions_bike_48px.png"' +
 '" /><span class="walkscore-scoretext">' + "<br>Bike Score&reg;: " + '<div class="progress-circle over50 p'+json.bike.score+'"><span>'+json.bike.score+'</span><div class="left-half-clipper"><div class="first50-bar"></div><div class="value-bar"></div></div></div>' + '</span></a>' + json.bike.description+'</center>');
    }
    else if (json.bike.score < 51){
return('<center><a target="_blank" href="' + json.help_link + '"><img src="/assets/1488635917_ic_directions_bike_48px.png"' +
 '" /><span class="walkscore-scoretext">' + "<br>Bike Score&reg;: " + '<div class="progress-circle p'+json.bike.score+'"><span>'+json.bike.score+'</span><div class="left-half-clipper"><div class="first50-bar"></div><div class="value-bar"></div></div></div>' + '</span></a>' + json.bike.description+'</center>');
    }
}

