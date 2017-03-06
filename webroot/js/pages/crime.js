function getCrimeDetailData(loc, success, error) {
	var loc_lat = loc.lat;
	var loc_long = loc.lng;
	var radiusMeters = loc.rad;

	//Figure out the last six months and get in range
	var date_marker = new Date(new Date().getFullYear(),new Date().getMonth(),01);

	var start_range = '\'' + date_marker.getFullYear().toString() + '-' + 
		('0' + (date_marker.getMonth()+1).toString()).slice(-2) + '-01T00:00:00\'';
	
	date_marker.setMonth(date_marker.getMonth() -5);
	
	var end_range = '\'' + date_marker.getFullYear().toString() + '-' + 
		('0' + (date_marker.getMonth()).toString()).slice(-2) + '-01T00:00:00\'';

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
		//Build 6 month recap table headers
		var tableCols = ["Month/Year", "Incident Count", "Most common", "2nd Most Common", "3rd Most Common"];
		var tableString = '<table class=tg>';
		for (var i = 0; i < tableCols.length; i++){
			tableString += '<th>' + tableCols[i] + '</th>';
		}

		var grouped_data = [];
		$.each(data, function( index, value ) {
			var monthdate = new Date(value.date_reported.toString())
			monthdate.setTime(monthdate.getTime() + monthdate.getTimezoneOffset()*60*1000 );
			monthdate.setDate(1);
			monthdate.setHours(1);
			monthdate.setMinutes(1);
			monthdate.setSeconds(1);

			var selectedMonthGroup = null;
			
			var alreadyInList = false;
			grouped_data.forEach(function(element) {
				if(element.grouped_month.getTime() == monthdate.getTime()) {
					alreadyInList = true;
					element.total_report_count++;
					selectedMonthGroup = element;
					return;
				}
			}, this);
			if(!alreadyInList)
			{
				var nw = new Object()
				nw.grouped_month = monthdate;
				nw.total_report_count = 1;
				nw.types = [];
				grouped_data.push(nw);
				selectedMonthGroup = nw;
			} 
			
			//Now we we will always have a selected Month group that is the right 
			//element to add the type record to with a types attr.
			var alreadyInListType = false;
			selectedMonthGroup.types.forEach(function(element) {
				if(element.name == value.offense_type) {
					alreadyInListType = true;
					element.count++;
					return;
				}
			}, this);
			if(!alreadyInListType)
			{
				var nw = new Object()
				nw.name = value.offense_type;
				nw.count = 1;
				selectedMonthGroup.types.push(nw);
			}
		
		});

		$.each(grouped_data, function( index, value ) {
			var simplePropertyRetriever = function(obj) {
				return obj.count;
			};

			sort(simplePropertyRetriever, value.types);
			
			value.first_common_type = value.types[0].name + ' (' + value.types[0].count + ')';
			value.second_common_type = value.types[1].name+ ' (' + value.types[1].count + ')';
			value.third_common_type = value.types[2].name+ ' (' + value.types[2].count + ')';
		});


		// Tablefy for display
		grouped_data.reverse();
		$.each(grouped_data, function( index, value ) {
			tableString += '<tr><td>' + crimeHtmlEncode(displayMonthYear(grouped_data[index].grouped_month))
				    + '</td><td>' + crimeHtmlEncode(grouped_data[index].total_report_count) + '</td><td>'
				    + crimeHtmlEncode(grouped_data[index].first_common_type) + '</td><td>'
					+ crimeHtmlEncode(grouped_data[index].second_common_type) + '</td><td>'
					+ crimeHtmlEncode(grouped_data[index].third_common_type) + '</td></tr>';
		});

		// Google Charts API Piechart of most common crime types. 
		//  <WIP>
	

		return success(tableString);
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

var sort = function (propertyRetriever, arr) {
    arr.sort(function (a, b) {
        var valueA = propertyRetriever(a);
        var valueB = propertyRetriever(b);

        if (valueA < valueB) {
            return 1;
        } else if (valueA > valueB) {
            return -1;
        } else {
            return 0;
        }
    });
};

var displayMonthYear = function(date){
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", 'December'];
	return months[date.getMonth()] + " " + date.getFullYear();
};