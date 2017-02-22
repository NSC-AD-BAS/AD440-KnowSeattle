function getWalkScoreData(loc, success, error) {
   var url="php/cors_helper.php?f=walkscore";
   $.ajax({
         url: url,
         type:'GET',
         data: {loc: loc}
      }).done(function (data) {
         var json = JSON.parse(data);
         var summary = "<li>Walk: " + json.walkscore + "</li><li>Transit: " + json.transit.score + "</li><li>Bike: " + json.bike.score + "</li>";
         success(summary);
      }).fail(function() {
         var summary = "Error getting WalkScore data";
         console.error(summary);
         error(summary);
      });
   }

//The code below was taken from the page source for the walk-score API documentation and is currently unused.
//We may eventually want to add in the infoIconHtml walk score to some of the pages.

//to demonstrate all of our formatting options, we'll pass the json on to a series of display functions.
//in practice, you'll only need one of these, and the ajax call could call it directly as it's onSuccess callback
function displayWalkScores(jsonStr) {
   displayWalkScore(jsonStr);
}

//show the walk score -- inserts walkscore html into the page.  Also needs CSS from top of file
function displayWalkScore(jsonStr) {
   var json=(jsonStr) ? eval('(' + jsonStr + ')') : ""; //if no response, bypass the eval

   //if we got a score
   if (json && json.status == 1) {
      var htmlStr = '<a target="_blank" href="' + json.help_link + '"><img src="' + json.logo_url + '" /><span class="walkscore-scoretext">' + json.walkscore + '</span></a>';
   }
   //if no score was available
   else if (json && json.status == 2) {
      var htmlStr = '<a target="_blank" href="' + json.help_link + '"><img src="' + json.logo_url + '" /></a> <a href="' + json.ws_link + '"><span class="walkscore-noscoretext">Get Score</span></a>';
   }
   //if didn't even get a json response
   else {
      var htmlStr = '<a target="_blank" href="https://www.walkscore.com"><img src="//cdn2.walk.sc/2/images/api-logo.png" /> <span class="walkscore-noscoretext">Get Score</span></a> ';
   }
   var infoIconHtml = '<span id="ws_info"><a href="https://www.redfin.com/how-walk-score-works" target="_blank"><img src="//cdn2.walk.sc/2/images/api-more-info.gif" width="13" height="13"" /></a></span>';

   //if you want to wrap extra tags around the html, can do that here before inserting into page element
   htmlStr = '<p>' + htmlStr + infoIconHtml + '</p>';

   //insert our new content into the container div:
   $("#walkscore-div").html(htmlStr);
}
