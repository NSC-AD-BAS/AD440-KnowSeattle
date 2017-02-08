function getConcertData(loc, map) {
   return "You called me";
}



// function displayResults() {
//    //Here's some google map stuff we need
//
//
//    long = form.elements.long.value;
//    lat  = form.elements.lat.value;
//    rad  = form.elements.radius.value * 1609;
//    res  = form.elements.results.value;
//
//    //Set some reasonable defaults
//    long = long ? long : -122.3356122;          //Default long to somewhere in Seattle
//    lat  = lat  ? lat  :  47.6991903;           //Default lat to somewhere in Seattle
//    rad  = rad && rad <= 16090 ? rad : 1609;    //Default radius to 1 mile
//    res  = res  ? res  : 100;                   //Default to 100 results
//
//    var withinCircle = 'within_circle(incident_location, ' + lat + ', ' + long + ', ' + rad + ')';
//    var incidentDataset = '3k2p-39jp';
//    var incidentURL = 'data.seattle.gov';
//    var consumer = new soda.Consumer(incidentURL);
//
//    document.write('<h4>Fetching Incident Data for ' + res + ' Rows.  Please be Patient</h4>');
//    //Miles to Meters = * 1609
//    var query = consumer.query()
//       .withDataset(incidentDataset)
//       .limit(res)
//       .where(
//          withinCircle
//       )
//       .getRows()
//       .on('success', function (rows) {
//          points = [];
//          document.write('<h2>Success! ' + rows.length + ' records returned</h2>');
//          //Panel
//          document.write('<div id="floating-panel">');
//          document.write('<button onclick="toggleHeatmap()">');
//          document.write('Toggle Heatmap</button>');
//          document.write('<button onclick="changeGradient()">Change gradient</button>');
//          document.write('<button onclick="changeRadius()">Change radius</button>');
//          document.write('<button onclick="changeOpacity()">Change opacity</button>');
//          document.write('</div>');
//
//          document.write('<div id="map" style="width: 60%; height: 60%; background-color: grey"></div>');
//          document.write('<table>');
//          for (var i = 0; i < rows.length; i++) {
//             document.write('<tr>');
//             document.write('<td>' + rows[i].event_clearance_description + '</td>');
//             document.write('<td>' + rows[i].hundred_block_location + '</td>');
//             document.write('<td>' + rows[i].latitude + '</td>');
//             document.write('<td>' + rows[i].longitude + '</td>');
//             document.write('</tr>');
//
//             var point = new google.maps.LatLng(rows[i].latitude, rows[i].longitude);
//             points.push(point);
//          }
//          document.write('</table>');
//          initMap();
//       })
//       .on('error', function (error) {
//          console.error(error);
//          document.write("An error occurred running your query.  Check your inputs and try again.");
//       });
//    }

