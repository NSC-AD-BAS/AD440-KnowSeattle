

function getParks(loc, success, error)
{
    var lat = loc.lat;
    var long = loc.lng;
    var radius = loc.rad;
    var radiusMeters = radius * 1609;
    //1609 Meters in a mile

    $.ajax({
            //url: "https://data.seattle.gov/resource/ye65-jqxk.json",
            url: "https://data.seattle.gov/resource/3c4b-gdxv.json",
            type: "GET",
            data: {
                "$where" : "within_circle(location, "
                + lat + ", " + long + ", "+ radiusMeters + ")"
            }
        }).done(function(data){
            var i;
            var j;
            var parks = [];
            var out = '<table class=tg><th>Park Name</th><th>Park Address</th><th>Park Features</th>';

            for(i = 0; i < data.length; i++)
            {
                //console.log(data[i]);
                // Check the name of the location for the word park. If contained, move on, else next item in the dataset
                if(data[i].common_name != null) {
                    if (wordInString(data[i].common_name, "park"))
                    {
                        var p = createParkObject(data[i].common_name, data[i].address, data[i].city_feature);
                        // console.log("Successful parkObject creation of park: " + p.parkname);

                        if (parks.length == 0) {
                            parks.push(p);
                            // console.log("Pushed parkObject first time: " + p.parkname);
                        } else {
                            var check = false;
                            var index;
                            // console.log("Checking the array for existing parkobject: " + p.parkname);
                            for (j = 0; j < parks.length || check; j++) {
                                var indexCheck = j + 1;
                                //console.log("Current index position: " + indexCheck + " of " + parks.length);
                                //console.log("Current park at index is: " + parks[j].parkname);
                                check = wordInString(parks[j].parkname, p.parkname);
                                if (check)
                                {
                                    index = j;
                                    // console.log("parkobject found at index: " + index + ".");
                                    break;
                                }
                            }
                            if (!check) {
                                parks.push(p);
                                // console.log("This parkobject, " + p.parkname + ", is not in the array. ADDED TO ARRAY.");
                            } else {
                                // console.log("This parkobject, " + p.parkname + ", already exists, adding feature");
                                // console.log("Current parkfeature: " + parks[index].parkfeature + ".");
                                // console.log("Feature to add: " + p.parkfeature + ".");
                                var feature = parks[index].parkfeature;
                                var sep = ", ";
                                var newFeature = parks[index].parkfeature.concat(sep, p.parkfeature);
                                addFeature(parks[index], newFeature);
                                // console.log("Pushed the feature");
                            }
                        }
                    } else {
                        // console.log("Not a park");
                    }
                }

            }

            for(i = 0; i < parks.length; i++)
            {
                out += '<tr><td>' + parks[i].parkname + '</td><td>' + parks[i].parkaddress + '</td><td>'
                    + parks[i].parkfeature + '</td></tr>';

            }
            out += '</table></div>';
            success(out);
        }).fail(function(data){
            var out = '<div>There was a problem finding parks in your area: ' + data.responseJSON.message + '</div>';
            error(out);
        });
}

// Function to add park objects
function createParkObject(pName, pAddress, pFeature)
{
    var parkObject = {
        parkname: new RegExp(/(\*)+/g).test(pName) ? pName.replace(new RegExp(/(\*)+/g, '')) : pName,
        parkaddress: pAddress,
        parkfeature: pFeature
    };
    return parkObject;
}

function wordInString(s, word){
    return new RegExp( '\\b' + word + '\\b', 'i').test(s);
}

function addFeature(parkObject, newFeature) {
    // console.log("addFeature call, adding" + newFeature + " to current park listing");
    parkObject.parkfeature = newFeature;
}

function getFeatureList() {
    $.ajax({
        url: "https://data.seattle.gov/resource/64yg-jvpt.json",
        type: "GET",
        data: {
            "$limit" : 5000,
            "$select" : "feature_desc",
            "$group" : "feature_desc"
        }
    }).done(function (data) {
        console.log(data);
    }).fail(function (error) {
        alert("Error retrieving data: " + error);
        console.log(error);
    });
}

function getLocation() {
    loc = {
        lat: 47.6062095,
        lng: -122.3320708,
        zip: null,
        rad: 2,
        err: null,
        pid: null
    };
    return loc;
}
