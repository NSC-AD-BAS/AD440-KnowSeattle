
	//Make an ajax call to a php page on your domain that will fetch json data from the Walk Score API
	//here we use the JQuery library for our Ajax call, but you can use whatever system you like
	function injectWalkScore(address,lat,lon){
	  //return;
		address = encodeURIComponent(address);
		var url="get-walkscore-data.php?address=" + address + "&lat=" + lat + "&lon=" + lon;
		$.ajax( {
			url: url,
			type:'GET',
			success: function(data) { displayWalkScores(data); },
			error: function(){ displayWalkScores(""); }
			}
		);
	}

	function injectTransitScore(address,lat,lon){
	  //return;
		address = encodeURIComponent(address);
		var url="get-walkscore-data.php?lat=" + lat + "&lon=" + lon + "&city=Seattle&transit_score_city=Seattle&state=WA";
		$.ajax( {
			url: url,
			type:'GET',
			success: function(data) { displayTransitScore(data); },
			error: function(){ displayTransitScore(""); }
			}
		);

	}

	//to demonstrate all of our formatting options, we'll pass the json on to a series of display functions.
	//in practice, you'll only need one of these, and the ajax call could call it directly as it's onSuccess callback
	function displayWalkScores(jsonStr) {
		displayWalkScore(jsonStr);
	}

	//show the walk score -- inserts walkscore html into the page.  Also needs CSS from top of file
	function displayWalkScore(jsonStr) {
		var json=(jsonStr) ? eval('(' + jsonStr + ')') : ""; //if no response, bypass the eval

		if (json && json.status == 1) { //if we got a score == 1
		  var scoreText = json.walkscore;
		  var href = json.help_link;
		}
		else if (json && json.status == 2) { //if no score was available == 2
		  var scoreText = 'Get Score';
		  var href = json.help_link;
		}
		else { //if didn't even get a json response
		  var scoreText = 'Get Score';
		  var href = 'https://www.walkscore.com';
		}

		//insert our new content into the container div:
		$(".walkscore-from-api").find("a.score-link").attr('href', href).attr('target', '_blank');
		$(".walkscore-from-api .scoretext").html(scoreText);
	}

	//show the transit score -- inserts transit score into the page.  Also needs CSS from top of file
	function displayTransitScore(jsonStr) {
		var json=(jsonStr) ? eval('(' + jsonStr + ')') : ""; //if no response, bypass the eval

		if (json.ts && json.ts.transit_score) { //if we got a score == 1
		  var scoreText = json.ts.transit_score;
		  var href = json.ts.help_link;
		}
		else { //if didn't even get a json response
		  var scoreText = 'Get Score';
		  var href = 'https://www.walkscore.com';
		}

		//insert our new content into the container div:
		$(".transitscore-from-api").find("a.score-link").attr('href', href).attr('target', '_blank');
		$(".transitscore-from-api").find(".scoretext").html(scoreText);
	}
