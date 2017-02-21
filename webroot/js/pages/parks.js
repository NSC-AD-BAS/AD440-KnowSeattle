var currentLoc;
//var radiusMeters = radius;// * 1609;
//1609 Meters in a mile
var parks = [];

function getParks(loc, display, success, error) {
    if(null == currentLoc) {
        currentLoc = loc;
    }
    if(parks.length != 0) {
        if (compareLocations(currentLoc, loc)) {
            if (display) {
                displayParks(display);
            }
            return;
        }
        parks = [];
        currentLoc = loc;
    }

    $.ajax({
            url: "https://data.seattle.gov/resource/3c4b-gdxv.json",
            type: "GET",
            data: {
                "$where" : "within_circle(location, "
                + currentLoc.lat + ", " + currentLoc.lng + ", "+ currentLoc.rad + ")"
            }
        }).done(function(data){

            for(var i = 0; i < data.length; i++)
            {
                // Check the name of the location for the word park. If contained, move on, else next item in the dataset
                if(data[i].common_name != null) {
                    if (wordInString(data[i].common_name, "park"))
                    {
                        var p = createParkObject(data[i].common_name, data[i].address, data[i].city_feature);

                        if (parks.length == 0) {
                            parks.push(p);
                        } else {
                            var check = false;
                            var index;
                            for (var j = 0; j < parks.length || check; j++) {
                                var indexCheck = j + 1;
                                check = wordInString(parks[j].parkname, p.parkname);
                                if (check)
                                {
                                    index = j;
                                    break;
                                }
                            }
                            if (!check) {
                                parks.push(p);
                            } else {
                                var feature = parks[index].parkfeature;
                                var sep = ", ";
                                var newFeature = parks[index].parkfeature.concat(sep, p.parkfeature);
                                addFeature(parks[index], newFeature);
                            }
                        }
                    }
                }
            }
            if(display) {
                displayParks(display);
            } else {
                success("<li>There are " + parks.length + " parks in your area</li>");
            }
        }).fail(function(data){
            if(error) {
                var out = '<div>There was a problem finding parks in your area: ' + data.responseJSON.message + '</div>';
                error(out);
            }
        });
}

function compareLocations(currentLoc, loc){
    return currentLoc.lat === loc.lat && currentLoc.lng === loc.lng && currentLoc.rad === loc.rad;
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

function displayParks(display) {
    var out = '<table class=tg><th>Park Name</th><th>Park Address</th><th>Park Features</th>';
    for (var i = 0; i < parks.length; i++) {
        out += '<tr><td>' + parks[i].parkname + '</td><td>' + parks[i].parkaddress + '</td><td>'
            + parks[i].parkfeature + '</td></tr>';

    }
    out += '</table></div>';
    display(out);
}
