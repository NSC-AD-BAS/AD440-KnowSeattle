
$(document).ready(function(){
	$.ajax({
		url: 'sampleSchool.json',
		dataType: 'json',
		type: 'get',
		cache: false,
		success: function(data) {
						
		$(data.school).each(function(index, value){
			console.log(value.name + value.lat + value.lon);
			document.write(value.name + value.lat + value.lon);
				});
		var response = data;
		console.log(response);

	}

		});

	
	
});

