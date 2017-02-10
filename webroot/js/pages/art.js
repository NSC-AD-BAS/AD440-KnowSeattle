/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var summary_art_data =
        "<li>No data found</li>";

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

function getPublicArtSummary(loc) {
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
        countPublicArtFeatures(data);
    }).fail(function () {
    });
}

function countPublicArtFeatures(data) {
//    var typeMap = {};
//    for (var i = 0; i < data.length; i++) {
//        //string of events saved here
//        var dat = data[i]["classification"];
//        //counting the number of times a String appears
//        if (dat !== null) {
//            if (typeMap[dat]) {
//                typeMap[dat]++;
//            } else {
//                typeMap[dat] = 1;
//            }
//        }
//    }
//    return getArtCount(typeMap);
    var content = "";
    content += "<li>There are " + data.length + " art pieces</li>";
    summary_art_data = content;
//    return 
}

//counts the different amount of art features
function getArtCount(typeMap) {
    var content = "";
    if (typeMap == undefined || typeMap.length === 0) {
        content += "<li>There are no art pieces</li>";
    } else {
        for (var type in typeMap) {
            if (type !== 'undefined') {
                content += "<li>" + type + " : " + typeMap[type] + "</li>";
            }
        }
    }
    summary_art_data = content;
    return content;
}

function getPublicArtSummaryCount() {
    return summary_art_data;
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
    var content = '<table><tr><th>Artist Name</th><th>Title</th><th>Classification</th><th>Address</th>' +
            '<th>Location</th><th>Description</th></tr>';
    for (var i = 0; i < dataMap.length; i++) {
        if (dataMap[i] !== null) {
            var title = dataMap[i].title == null ? " " : dataMap[i].title;
            var artist_first_name = dataMap[i].artist_first_name == null ? " " : dataMap[i].artist_first_name;
            var artist_last_name = dataMap[i].artist_last_name == null ? " " : dataMap[i].artist_last_name;
            var classification = dataMap[i].classification == null ? " " : dataMap[i].classification;
            var location = dataMap[i].location == null ? " " : dataMap[i].location;
            var address = dataMap[i].address == null ? " " : dataMap[i].address;
            var description = dataMap[i].description == null ? " " : dataMap[i].description;
            //var website = dataMap[i].website == null ? "" : dataMap[i].website;
            content += '<tr><td>' + artist_first_name + " " + artist_last_name + '</td><td>' +
                    title + '</td><td>' +
                    classification + '</td><td>' +
                    address + '</td><td>' +
                    location + '</td><td>' +
                    description + '</td></tr>';
            //website + '</td></tr>';
        }
    }
    content += "</table>";
    return content;
}

