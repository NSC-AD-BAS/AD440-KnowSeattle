var hospitalData =
   {
      "Hospital": [
         {
            "id": "0",
            "name": "Navos",
            "address": "2600 SW Holden st",
            "zip_code": "98126",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.366238",
            "latitude": "47.534193",
            "url": "https://www.navos.org/",
            "rating": "marginal"
         },
         {
            "id": "1",
            "name": "Veterans Hospital",
            "address": "1600 S Columbia Way",
            "zip_code": "98108",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.309169",
            "latitude": "47.562454",
            "url": "http://www.pugetsound.va.gov/",
            "rating": "sub-standard"
         },
         {
            "id": "2",
            "name": "Seattle Cancer Care Alliance",
            "address": "825 Eastlake Ave E",
            "zip_code": "98109",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.329169",
            "latitude": "47.626672",
            "url": "http://www.seattlecca.org/",
            "rating": "excellent"
         },
         {
            "id": "3",
            "name": "Swedish Medical Center - Ballard",
            "address": "5300 Tallman Ave NW",
            "zip_code": "98107",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.380473",
            "latitude": "47.668019",
            "url": "http://www.swedish.org/locations/ballard-campus/",
            "rating": "standard"
         },
         {
            "id": "4",
            "name": "Swedish Medical Center - Cherry Hill",
            "address": "500 17th Ave",
            "zip_code": "98122",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.31131",
            "latitude": "47.607411",
            "url": "http://www.swedish.org/locations/cherry-hill-campus",
            "rating": "Average"
         },
         {
            "id": "5",
            "name": "Swedish Medical Center - First Hill",
            "address": "747 Broadway",
            "zip_code": "98122",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.321928",
            "latitude": "47.608842",
            "url": "http://www.swedish.org/locations/first-hill-campus",
            "rating": "Average"
         },
         {
            "id": "6",
            "name": "Kindred Hospital Seattle",
            "address": "10631 8th Ave",
            "zip_code": "98125",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.345039",
            "latitude": "47.507575",
            "url": "http://www.kindredhospitalseattle.com",
            "rating": "above average"
         },
         {
            "id": "7",
            "name": "Group Health Hospital",
            "address": "201 16th Ave E",
            "zip_code": "98112",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.311817",
            "latitude": "47.619195",
            "url": "https://www.ghc.org/html/public/locations/capitol-hill",
            "rating": "Average"
         },
         {
            "id": "8",
            "name": "Virginia Mason Hospital",
            "address": "1100 9th Ave",
            "zip_code": "98101",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.32793",
            "latitude": "47.60953",
            "url": "https://www.virginiamason.org/",
            "rating": "above average"
         },
         {
            "id": "9",
            "name": "Northwest Hospital & Medical Center",
            "address": "1550 N. 115th Street",
            "zip_code": "98133",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.336888",
            "latitude": "47.714248",
            "url": "https://www.nwhospital.org/",
            "rating": "Standard"
         },
         {
            "id": "10",
            "name": "Seattle Children's",
            "address": "4800 Sand Point Way NE",
            "zip_code": "98105",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.282298",
            "latitude": "47.661131",
            "url": "https://www.seattlechildrens.org/",
            "rating": "Excellent"
         },
         {
            "id": "11",
            "name": "Harborview Medical Center",
            "address": "325 9th Ave",
            "zip_code": "98104",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.323769",
            "latitude": "47.603993",
            "url": "http://www.uwmedicine.org/harborview",
            "rating": "Below average"
         },
         {
            "id": "12",
            "name": "University of Washington Medical Center",
            "address": "1959 NE Pacific St",
            "zip_code": "98105",
            "city": "Seattle",
            "state": "Washington",
            "longitude": "-122.309072",
            "latitude": "47.650344",
            "url": "http://www.uwmedicine.org/uw-medical-center",
            "rating": "Excellent"
         }
      ]
   };

var summary_data =
   "<li>3 within 3 miles</li>" +
   "<li>4.5 star rating</li>";

function getHospData(loc, display) {
   var hospitals = hospitalData.Hospital;
   var miles = true, arr = [], within_range = 0, avg = 0;
   for (var i = 0; i < hospitals.length; i++) {
      var hosp = {
         url: hospitals[i].url,
         name: hospitals[i].name,
         address: hospitals[i].address,
         city: hospitals[i].city,
         state: hospitals[i].state,
         zip: hospitals[i].zip_code,
         dist: getRadius(hospitals[i].latitude, hospitals[i].longitude, loc.lat, loc.lng, miles),
         rating: hospitals[i].rating
      };
      arr.push(hosp);
      if (hosp.dist <= 3) {
         within_range++;
         avg += get_rating(hosp.rating)
      }
   }
   if (within_range > 0){
      avg = Math.round((avg / within_range) * 100) / 100;
      summary_data =
         "<li>" + within_range + " within 3 miles</li>" +
         "<li>Avg Rating: " + get_stars(avg) + "&nbsp;(" + avg + ")</li>";
   } else {
      summary_data =
         "<li>No hospitals found within 3 miles of location</li>";
   }
   arr.sort(function (a, b) {
      return a.dist < b.dist ? -1 : 1;
   });


   if (display) {
      var str = "<table><tr><th>Hospital Name</th><th>Address</th><th>Distance</th></tr>";
      for (var i = 0; i < arr.length; i++) {
         str += "<tr>";
         str += "<td><a href='" + arr[i].url + "'>" + arr[i].name + "</a></td>";
         str += "<td>" + arr[i].address + " " + arr[i].city + ", " + arr[i].state + "  " + arr[i].zip + "</td>";
         str += "<td>" + arr[i].dist + "</td>";
         str += "<tr>";
      }
      str += "</table>";
      return str;
   }
}

function get_stars(rating) {
   // var str = "<span class='fa fa-star'><span class='fa-star'></span><span class='fa-star-half'></span>";
   var str = "<div class='fa'>";
   for (var i = rating; i > 1; i--) {
      str += "<span class='fa-star'></span>";
   }
   if (i >= 0.51) {
      str += "<span class='fa-star'></span>";
   } else if (i >= 0.333) {
      str += "<span class='fa-star-half'></span>";
   }
   return str + "</div>";
}

function get_rating(rating) {
   switch (rating.toLowerCase()) {
      case "sub-standard":
         return 1;
      case "marginal":
      case "below average":
         return 2;
      case "average":
      case "standard":
         return 3;
      case "above average":
         return 4;
      case "excellent":
         return 5;
      default:
         return 3;
   }
}

function get_hospital_summary() {
   return summary_data;
}
