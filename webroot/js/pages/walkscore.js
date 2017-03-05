function getWalkScoreData(loc, success, error) {
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
   }, function () {
      var summary = "Error getting WalkScore data";
      console.error(summary);
      error(summary);
   });
}
