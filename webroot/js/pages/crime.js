function getCrimeDetailData(loc, success, error) {
	var loc_lat = loc.lat;
	var loc_long = loc.lng;
	var radiusMeters = loc.rad;


	//Figure out the last six months and get in range
	var date_marker = new Date(new Date().getFullYear(),new Date().getMonth(),01);
	var start_range = '\'' + date_marker.getFullYear().toString() + '-' + 
		('0' + (date_marker.getMonth() +1).toString()).slice(-2) + '-01T00:00:00\'';
	date_marker.setMonth(date_marker.getMonth() -1);
	var end_range = '\'' + date_marker.getFullYear().toString() + '-' + 
		('0' + (date_marker.getMonth() +1).toString()).slice(-2) + '-01T00:00:00\'';
	
	//Preform Ajax and Update UI
	$.ajax({
		url: "https://data.seattle.gov/resource/y7pv-r3kh.json",
		type: "GET",
		data: {
			"$limit" : 100,
			"$where": 'within_circle(location,' + loc_lat + ',' + loc_long + ', ' + radiusMeters + ')' 
			+ ' and date_reported between ' + end_range + ' and ' + start_range		
		}
	}).done(function (data) {
		
		var out = '<table class=tg><th>Offense Type</th><th>Reported</th><th>Location</th>';
    	for (var i = 0; i < data.length; i++) {
			var temmm = data[i];
			debugger;

			out += '<tr><td>' + crimeHtmlEncode(data[i].summarized_offense_description)
				 + '</td><td>' + crimeHtmlEncode(data[i].date_reported) + '</td><td>'
				+ crimeHtmlEncode(data[i].hundred_block_location) + '</td></tr>';
    	}
    	out += '</table></div>';


		return success(out);
	}).fail(function(data){
		var out = '<div>There was a problem getting the crime data in your area. </div>';
		error(out);
	});
}

function getCrimeSummary(loc, success, error) {
	var loc_lat = loc.lat;
	var loc_long = loc.lng;
	var radiusMeters = loc.rad;
	
	var date_marker = new Date(new Date().getFullYear(),new Date().getMonth(),01);
	var start_range = '\'' + date_marker.getFullYear().toString() + '-' + 
		('0' + (date_marker.getMonth() +1).toString()).slice(-2) + '-01T00:00:00\'';
	date_marker.setMonth(date_marker.getMonth() -2);
	var end_range = '\'' + date_marker.getFullYear().toString() + '-' + 
		('0' + (date_marker.getMonth() +1).toString()).slice(-2) + '-01T00:00:00\'';

	//Preform Ajax and Update UI
	$.ajax({
		url: "https://data.seattle.gov/resource/y7pv-r3kh.json",
		type: "GET",
		data: {
			"$limit" : 50000,
			"$where": 'within_circle(location,' + loc_lat + ',' + loc_long + ', ' + radiusMeters + ')' 
			+ ' and date_reported between ' + end_range + ' and ' + start_range	
		}
	}).done(function (data) {
		var grouped_data = [];
		$.each(data, function( index, value ) {
			var monthdate = new Date(value.date_reported.toString())
			monthdate.setTime(monthdate.getTime() + monthdate.getTimezoneOffset()*60*1000 );
			monthdate.setDate(1);
			monthdate.setHours(1);
			monthdate.setMinutes(1);
			monthdate.setSeconds(1);

			var alreadyInList = false;
			grouped_data.forEach(function(element) {
				if(element.grouped_month.getTime() == monthdate.getTime()) {
					alreadyInList = true;
					element.total_report_count++;
					return;
				}
			}, this);
			if(!alreadyInList)
			{
				var nw = new Object()
				nw.grouped_month = monthdate;
				nw.total_report_count = 1;
				grouped_data.push(nw);
			} 
		});
		var month = new Array();
		month[0] = "Jan";
		month[1] = "Feb";
		month[2] = "Mar";
		month[3] = "Apr";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "Aug";
		month[8] = "Sep";
		month[9] = "Oct";
		month[10] = "Nov";
		month[11] = "Dec";
		var htmlToReturn = "<li>Incidents in " + month[grouped_data[1].grouped_month.getMonth()]  + ": " + 
			grouped_data[1].total_report_count + "</li>" +
			"<li>Incidents in " + month[grouped_data[0].grouped_month.getMonth()]  + ": " + 
			grouped_data[0].total_report_count + "</li>";
		return success(htmlToReturn);
	}).fail(function(data){
		var out = '<div>There was a problem getting the crime data in your area. </div>';
		error(out);
	});
}


function crimeHtmlEncode(value){
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div />').text(value).html();
}
