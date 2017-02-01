
function func(lat, lon, dis){
    key = "10284fa9f60a76d6175a7fb5d834ad20";
$.getJSON("http://api.walkscore.com/score?format=json&lat="+lat+"&lon="+lon+"&transit=1&bike=1&wsapikey="+key, function(data){
              document.getElementById("scoreresults").innerHTML = "walk score: " + data.walkscore + " - transit score: " + data.transit.score + " - bike score: " + data.bike.score;
              });
}
