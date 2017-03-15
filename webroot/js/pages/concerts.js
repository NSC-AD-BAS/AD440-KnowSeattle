
	/*function getConcertData(loc, success, error){
        var zip = loc.zip;
        var radius = 0;//parseInt(document.getElementById('rad').value);

	    //var apikey = "6mnky94spc5h9u8n3fjxq6t7"; //joes
	    var apikey = "k5dywsuqf9vaexvg5xczcspf"; //brandons
		var url = "php/cors_helper.php?f=concerts";

		$.getJSON("http://api.jambase.com/events?zipCode=" + zip +"&radius=" + radius + "&page=0&api_key=" + apikey,
			function(data) {
    		//console.log(data.Events);
    		var json = "<div style='display: flex; flex-wrap: wrap'>";

    		for (i = 0; i < 15; i++)//data.Info.TotalResults for all results, currently returns just 50
    		{

                var date = data.Events[i].Date;
                var split = date.split("T",2);

    		    json += "<div class='tile' ><b>Artists:</b><br /><div style='font-size: 15px'>" +  data.Events[i].Artists[0].Name + "</div>  <b>Venue:</b><br /><div style='font-size: 15px'>" + data.Events[i].Venue.Name + "</div> <b>Day:</b><br /><div style='font-size: 15px'> " + split[0] + "</div> <b>Time:</b><br /><div style='font-size: 15px'> " + split[1] + "</div></div>";
			    // shows 1st artists, venue, date
    			//document.write("<br>");

    		}
            json += "</div><br ><br /><br /><a href=http://www.jambase.com>Results powered by JamBase™</a>";
            success(json);
	     });
         var out = 'There was a problem getting the concert data in your area.';
         error(out);
    }*/

   var summary = "<li>Fetching Data...</li>";

   function getConcertData(loc, success, error, display) {
      var key = "LZMwZulsa6nBIZE0";      //TODO: This should be a node or mongo get query #Security
      var url = "http://api.songkick.com/api/3.0/events.json?apikey=LZMwZulsa6nBIZE0&location=geo:" + loc.lat + "," + loc.lng;

      getCorsData({
         method: 'GET',
         url: url,
         data: ""
      }, function (data) {
         var json = JSON.parse(data);
         summary = "";
         if (display) {
            for (var i = 0; i < 15; i++)//data.Info.TotalResults for all results, currently returns just 50
            {
               //var date = json.resultsPage.results.event[i].start.date;
               var time = json.resultsPage.results.event[i].start.time;
               var venue = json.resultsPage.results.event[i].venue.displayName;
               //var artistName = json.resultsPage.results.event[i].performance[0].artist.displayName;//loop to get all performing artists
               var showTitle = json.resultsPage.results.event[i].displayName;

               //var split = date.split("T",2);


               summary += "<div class='tile' >";
               summary += "<b>Show:</b><br /><div style='font-size: 15px'>" +   showTitle + "</div> ";
               //summary += "<b>Artists:</b><br /><div style='font-size: 15px'>" +   artistName + "</div> ";
               summary += "<b>Venue:</b><br /><div style='font-size: 15px'>" + venue + "</div>";
               //summary += "<b>Day:</b><br /><div style='font-size: 15px'> " + date + "</div>";
               summary += "<b>Time:</b><br /><div style='font-size: 15px'> " + time + "</div>";
               summary += "</div>";
            }
            success(summary);
         } else {
            success("<li>" + json.resultsPage.results.event.length + " concerts in your area" + "</li>");
         }
      }, function (data) {
         summary = "Error getting Concert data.  ";
         console.error(summary  + data);
         error(summary);
      });
   }
