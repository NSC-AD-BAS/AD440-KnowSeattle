/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function getPublicArtData(loc, success, error, detailed) {
    //variable loc used for testing
    $.ajax({
        url: "https://data.seattle.gov/resource/249z-59hj.json",
        type: "GET",
        data: {
            "$limit": 10000,
            "$where": "within_circle(geolocation, " + loc.lat + ", " + loc.lng + ", " +
                    1500 + ")"
        }
    }).done(function (data) {
        success(parsePublicArtFeatures(data, detailed));
    }).fail(function () {
        var out = '<div>There was a problem getting the culture data in your area. </div>';
        error(out);
    });
}

function getPublicArtSummary(loc, success, error) {
    //variable loc used for testing
    $.ajax({
        url: "https://data.seattle.gov/resource/249z-59hj.json",
        type: "GET",
        data: {
            "$limit": 10000,
            "$where": "within_circle(geolocation, " + loc.lat + ", " + loc.lng + ", " +
                    1500 + ")"
        }
    }).done(function (data) {
        success(countPublicArtFeatures(data));
    }).fail(function () {
        error("There was an error getting the Public Art Summary");
    });
}

function countPublicArtFeatures(data) {
    var typeMap = {};
    for (var i = 0; i < data.length; i++) {
        //string of events saved here
        var dat = data[i]["classification"];
        //counting the number of times a String appears
        if (dat !== null) {
            if (typeMap[dat]) {
                typeMap[dat]++;
            } else {
                typeMap[dat] = 1;
            }
        }
    }
    var content = "";
    content += "<li>Art Pieces: " + data.length + "</li>";
    if (typeMap.hasOwnProperty("Sculpture")) {
        content += "<li>Sculptures: " + typeMap.Sculpture + "</li>";
    }
    return content;
}

function parsePublicArtFeatures(data) {
    var dataMap = [];
    for (var i = 0; i < data.length; i++) {
        //string of events saved here
        var dat = data[i]["classification"];
        //counting the number of times a String appears
        if (dat !== null) {
            dataMap.push(data[i]);
        }
    }
    return getArtData(dataMap);
}

function getArtData(dataMap) {
    var content = "<table class='hor-minimalist-b'><tr><th>Title</th><th>Artist Name</th><th>Classification</th><th>Address</th>" +
            '<th>Location</th></tr>';
    for (var i = 0; i < dataMap.length; i++) {
        if (dataMap[i] !== null) {
            var title = dataMap[i].title == null ? " " : dataMap[i].title;
            var artist_first_name = dataMap[i].artist_first_name == null ? "n/a" : dataMap[i].artist_first_name;
            var artist_last_name = dataMap[i].artist_last_name == null ? "n/a" : dataMap[i].artist_last_name;
            var artist_name = artist_last_name == "n/a" ? "n/a" : artist_first_name + " " + artist_last_name;
            var classification = dataMap[i].classification == null ? "n/a" : dataMap[i].classification;
            var location = dataMap[i].location == null ? "n/a" : dataMap[i].location;
            var address = dataMap[i].address == null ? "n/a" : dataMap[i].address;
            var description = dataMap[i].description == "''" ? "no description" : dataMap[i].description;
            content += '<tr><td><div class="tooltip">' + title + 
                    getDescriptionSpan(description) + '</div></td><td>' +
                    artist_name + '</td><td>' +
                    classification + '</td><td>' +
                    address + '</td><td>' +
                    location + '</td></tr>';
        }
    }
    content += "</table>";
    return content;
}

function getDescriptionSpan(description){
   var content = "<span class='tooltiptext'>";
   content += description;
   content += "</span>";  
   return content;
}

