
function getSchoolsData(loc, success, error) {
	var str = "<table>";
   $.ajax({
      url: '/data/sampleSchool.json',
      dataType: 'json',
      type: 'get',
      cache: false,
      success: function(data) {
         /*
         $(data.school).each(function(index, value){
            str+= "<tr><td>" + value.name + "</td><td>" + value.lat + "</td><td>" + value.lon + "</td></tr>";
         });
         str += "</table>";
         success(str);
         */
         //store the JSON data in the schools variable
         var schools = data.school;
         //initialize miles to true and an array to store simplified school objects
         var miles = true, arr = [];
         //for each item in the JSON data iterate and push to arr
         for(var i = 0; i < schools.length; i++){
            var school = {
               url: schools[i].overviewLink,
               name: schools[i].name,
               address: schools[i].address,
               //use getRadius from geocode.js to calculate distance in miles
               dist: getRadius(schools[i].lat, schools[i].lon, loc.lat, loc.lng, miles),
               grades: schools[i].gradeRange
            };
            //push to array
            arr.push(school);

         }
         //verify results (can be removed after testing)
         // console.log(arr);
         //sort the array by distance from loc
         arr.sort(function (a, b) {
            return a.dist < b.dist ? -1 : 1;
         });

         //ADD CODE HERE FOR SUMMARY TILE REGARDLESS OF DISPLAY TRUE/FALSE

         //if display is set to true, generate result string for detail page
         // if (display) {
            var str = "<table><tr><th>School Name</th><th>Address</th><th>Grades</th><th>Distance</th></tr>";
            //display arbitrary number of results: 20
            for (var i = 0; i < 20; i++) {
               str += "<tr>";
               str += "<td><a href='" + arr[i].url + "'>" + arr[i].name + "</a></td>";
               str += "<td>" + arr[i].address + "</td>";
               str += "<td>" + arr[i].grades + "</td>";
               str += "<td>" + arr[i].dist + "</td>";
               str += "</tr>";
            }
         // }
         str += "</table>";
         success(str);
         }
      }).fail(function (data) {
   		error(data);
   	});
}


function getSchoolsSummary(loc, success, error) {
	var str = "<table>";
   $.ajax({
      url: '/data/sampleSchool.json',
      dataType: 'json',
      type: 'get',
      cache: false,
      success: function(data) {
         /*
         $(data.school).each(function(index, value){
            str+= "<tr><td>" + value.name + "</td><td>" + value.lat + "</td><td>" + value.lon + "</td></tr>";
         });
         str += "</table>";
         success(str);
         */
         //store the JSON data in the schools variable
         var schools = data.school;
         //initialize miles to true and an array to store simplified school objects
         var miles = true, arr = [];
         //for each item in the JSON data iterate and push to arr
         for(var i = 0; i < schools.length; i++){
            var school = {
               url: schools[i].overviewLink,
               name: schools[i].name,
               address: schools[i].address,
               //use getRadius from geocode.js to calculate distance in miles
               dist: getRadius(schools[i].lat, schools[i].lon, loc.lat, loc.lng, miles),
               grades: schools[i].gradeRange
            };
            //push to array
            arr.push(school);

         }
         //verify results (can be removed after testing)
         // console.log(arr);
         //sort the array by distance from loc
         arr.sort(function (a, b) {
            return a.dist < b.dist ? -1 : 1;
         });

         //ADD CODE HERE FOR SUMMARY TILE REGARDLESS OF DISPLAY TRUE/FALSE

         //if display is set to true, generate result string for detail page
         // if (display) {

            //display arbitrary number of results: 20
            for (var i = 0; i < 1; i++) {
               str += "<tr><td>";
               // str += arr[i].name;
               str += "tile data";
               str += "</td></tr>";
            }
         // }
         str += "</table>";
         success(str);
         }
      }).fail(function (data) {
   		error(data);
   	});
}
