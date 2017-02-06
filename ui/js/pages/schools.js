
function getSchoolsData(loc, success, error) {
	var str = "<table>";
   $.ajax({
      url: '/data/sampleSchool.json',
      dataType: 'json',
      type: 'get',
      cache: false,
      success: function(data) {
         $(data.school).each(function(index, value){
            str+= "<tr><td>" + value.name + "</td><td>" + value.lat + "</td><td>" + value.lon + "</td></tr>";
         });
         str += "</table>";
         success(str);
      }
   }).fail(function (data) {
		error(data);
	});
}

