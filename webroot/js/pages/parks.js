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
            if (data[i].common_name !== null) {
                if (wordInString(data[i].common_name, "park") && !wordInString(data[i].common_name, "ride")) {
                    var p = new Park(data[i].common_name, data[i].address, (data[i].city_feature === "Parks") ? null : data[i].city_feature);

                    if (parks.length == 0) {
                        parks.push(p);
                    } else {
                        var check = false;
                        var index;
                        for (var j = 0; j < parks.length || check; j++) {
                            check = parks[j].name === p.name;
                            if (check) {
                                index = j;
                                break;
                            }
                        }
                        if (!check) {
                            parks.push(p);
                        } else {
                            if (!(p.features[0] === "Parks")) {
                                parks[index].features.push(p.features[0]);
                            }
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

function Park(name, address, feature) {
    this.name = new RegExp(/(\*)+/g).test(name) ? name.replace(new RegExp(/(\*)+/g, '')) : name;
    this.address = address;
    this.features = [];
    if (null !== feature) {
        this.features.push(feature);
    }
}


function wordInString(s, word) {
    return new RegExp('\\b' + word + '\\b', 'i').test(s);
}

function displayParks(parks, display) {
    var out = '<table id="hor-minimalist-b"><thead><th scope="col">Name</th><th scope="col">Address</th><th scope="col">Features</th></thead><tbody>';
    for (var i = 0; i < parks.length; i++) {
        out += '<tr><td>' + parks[i].name + '</td><td>' + parks[i].address + '</td><td>'
            + parks[i].features + '</td></tr>';

    }
    out += '</tbody></table></div>';
    display(out);
}
