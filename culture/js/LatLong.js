/* 
 * Gets a address and prefills a lat long value needed
 * 
 * @author Samuel No
 */

/* global type */

$(function () {

    $('#json').click(function (e) {
        e.preventDefault();
        json();
    });

    $('#geocode').click(function (e) {
        e.preventDefault();
        geocodeAddress();
    });

    function json() {
        var latit = (document.getElementById('lat').value);
        var longit = (document.getElementById('lng').value);
        var radius = document.getElementById('rad').value;
//        radius = parseInt(document.getElementById('rad').value) * 1609;
        if (latit === null || latit === "" || longit === null || longit === "" ||
                radius === null || radius === "") {
            alert("The form must be filled");
            return false;
        } else {
            $.ajax({
                url: "https://data.seattle.gov/resource/3c4b-gdxv.json?$$app_token=IZLnwcjjGNvFpmxfooid8p5VI",
                type: "GET",
                data: {
                    "$limit": 10000,
                    "$where": "within_circle(location, " + latit + ", " + longit + ", " +
                            radius + ")AND(city_feature = 'Heritage Trees' " +
                            "OR city_feature = 'Viewpoints' OR city_feature = 'Museums and Galleries' " +
                            "OR city_feature = 'General Attractions' OR city_feature = 'Waterfront' " +
                            "OR city_feature = 'Public Art' OR city_feature = 'Libraries')"
                }
            }).done(function (data) {
                countCityFeatures(data);
            });
        }
    }
    function countCityFeatures(data) {
        $('#output').empty();
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
        //print contents of hashmap string and count recorded
        $('#output').append("<h3>CITY FEATURE COUNT</h3>");
        printCityFeatureCount(typeMap);
        getCultureData(dataMap);
    }

    function checkFeature(dat) {
        return (dat === "Libraries" || dat === "Heritage Trees" || dat === "Viewpoints" || dat === "Museums and Galleries" ||
                dat === "General Attractions" || dat === "Ceremonies" || dat === "Waterfront" ||
                dat === "Public Art");
    }
    
    function printCityFeatureCount(typeMap){
        for (var type in typeMap) {
            if (type !== 'undefined') {
                $('#output').append(type + " : " + typeMap[type] + "<br>");
            }
        }
    }
    
    function getCultureData(typeMap) {
        $('#output').append("<h3>CITY FEATURES</h3>");
        var content = "<table><tr><th>Name</th><th>Address</th><th>City Feature</th><th>Website</th></tr>";
        for (var i = 0; i < typeMap.length; i++) {
            if (typeMap[i] !== 'undefined') {
                var name = typeMap[i].common_name == null ? "" : typeMap[i].common_name;
                var address = typeMap[i].address == null ? "" : typeMap[i].address;
                var city_feature = typeMap[i].city_feature == null ? "" : typeMap[i].city_feature;
                var website = typeMap[i].website == null ? "" : typeMap[i].website;

                content += '<tr><td>' + name + '</td><td>' +
                        address + '</td><td>' +
                        city_feature + '</td><td>' +
                        website + '</td></tr>';
            }
        }
        content += "</table>";

        $('#output').append(content);
    }

    function geocodeAddress() {
        var address = document.getElementById('address').value;
        $.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAGjI71ShfO3kMt8NouBuHFE_8IJP_CJ3w",
            type: "GET",
            data: {
                "address": address
            },
            success: (function (data) {
                $('#output').empty();
                if (data.status === "ZERO_RESULTS") {
                    $('#output').append("<div>" + "Services are down." + "</div><br>");
                    $('#lat')[0].value = "";
                    $('#lng')[0].value = "";
                } else {
                    $('#lat')[0].value = data.results[0].geometry.location.lat;
                    $('#lng')[0].value = data.results[0].geometry.location.lng;
                }
            }),
            error: (function () {
                $('#output').empty();
                $('#output').append("<div>" + "Services are down." + "</div><br>");
            })
        });
    }
});