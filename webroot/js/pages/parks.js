var errorString = "There was a problem finding parks in your area.";

function getParksSummary(loc, success, error) {
    loadParksData(loc,
        function (parks) {
            success("<li>There are " + parks.length + " parks in your area</li>");
        },
        function () {
            error('<div>' + errorString + '</div>');
        }
    );
}

function getParks(loc, success, error) {
    loadParksData(loc, function (parks) {
            displayParks(parks, success);
        },
        function () {
            error('<div>' + errorString + '</div>');
        }
    );
}

function loadParksData(loc, success, error) {
    $.ajax({
        url: "https://data.seattle.gov/resource/3c4b-gdxv.json",
        type: "GET",
        data: {
            "$where": "within_circle(location, "
            + loc.lat + ", " + loc.lng + ", " + loc.rad + ")"
        }
    }).done(function (data) {
        var parks = [];

        for (var i = 0; i < data.length; i++) {
            // Check the name of the location for the word park. If contained, move on, else next item in the dataset
            if (data[i].common_name != null) {
                if (wordInString(data[i].common_name, "park") && !wordInString(data[i].common_name, "ride")) {
                    var p = createParkObject(data[i].common_name, data[i].address, data[i].city_feature);

                    if (parks.length == 0) {
                        parks.push(p);
                    } else {
                        var check = false;
                        var index;
                        for (var j = 0; j < parks.length || check; j++) {
                            var indexCheck = j + 1;
                            check = wordInString(parks[j].parkname, p.parkname);
                            if (check) {
                                index = j;
                                break;
                            }
                        }
                        if (!check) {
                            parks.push(p);
                        } else {
                            parks[index].parkfeature = parks[index].parkfeature + ", " + p.parkfeature;
                        }
                    }
                }
            }
        }
        if (null !== success) {
            success(parks);
        }
    }).fail(function (data) {
        if (null !== error) {
            error(data);
        }
    });
}

// Function to add park objects
function createParkObject(pName, pAddress, pFeature) {
    var parkObject = {
        parkname: new RegExp(/(\*)+/g).test(pName) ? pName.replace(new RegExp(/(\*)+/g, '')) : pName,
        parkaddress: pAddress,
        parkfeature: pFeature
    };
    return parkObject;
}

function wordInString(s, word) {
    return new RegExp('\\b' + word + '\\b', 'i').test(s);
}

function displayParks(parks, display) {
    var out = '<table class=tg><th>Name</th><th>Address</th><th>Additional Features</th>';
    for (var i = 0; i < parks.length; i++) {
        out += '<tr><td>' + parks[i].parkname + '</td><td>' + parks[i].parkaddress + '</td><td>'
            + parks[i].parkfeature + '</td></tr>';

    }
    out += '</table></div>';
    display(out);
}
