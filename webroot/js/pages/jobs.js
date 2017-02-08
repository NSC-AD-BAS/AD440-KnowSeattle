/*
* Script that interacts with various APIs; prints summary
* stats to the Jobs tile on home page, and prints detailed
* info to the Jobs detail page.
*
* Author: Kellan Nealy
*/

// Global vars
var avg_rating;
var indeed_query = "";
var zipcode;
var job_radius_miles = 1;
var job_type = "fulltime";
var limit = 1000;

// Glassdoor vars and JSON to avoid redundant API requests
var total_company_requests = 0;
var total_companies_recieved = 0;
var glassdoor_companies = [];

// Glassdoor vars to calculate average company rating
var total_matches_with_rating = 0;
var rating_sum = 0.0;

// Indeed JSON to avoid redundant API requests
var indeed_jobs_json;
var indeed_jobs_array;
var indeed_total_jobs = 0;

// CORS bypass
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

function getJobsDefault() {
   return "<li>Full-time Jobs: ???</li><li>Avg Company: ???</li>";
}

function getJobsSummary(loc, callback) {
   if (!loc.zip) {
      return getJobsDefault();
   }
   var indeed_options = getIndeedOptions(loc.zip);
   doCORSRequest({
      method: 'GET',
      url: "http://api.indeed.com/ads/apisearch" + indeed_options,
      data: ""
   }, function printResult(result) {
      indeed_jobs_json = xmlToJSON.parseString(result);
      indeed_total_jobs = 0;
      indeed_total_jobs = indeed_jobs_json.response[0].totalresults[0]._text;
      indeed_jobs_array = indeed_jobs_json.response[0].results[0].result;
      getGlassdoorCompanies(indeed_total_jobs, indeed_jobs_array, callback);
   });
}

function getGlassdoorCompanies(indeed_tot_jobs, indeed_jobs_arr, callback) {

   for (var i = 0; i < indeed_jobs_arr.length; i++) {
      var jobTitle = indeed_jobs_arr[i].jobtitle[0]._text;
      var companyName = indeed_jobs_arr[i].company[0]._text;
      console.log(companyName);
      var glassdoorOptions = getGlassdoorOptions(companyName);

      doCORSRequest({
         method: 'GET',
         url: "http://api.glassdoor.com/api/api.htm?" + glassdoorOptions,
         data: ""
      }, function printResult(result) {
         var JSONObject = JSON.parse(result);
         total_company_requests++;

         // only use exact matches
         var employersArray = JSONObject.response.employers;
         var bestMatchObj = employersArray[0];
         if (bestMatchObj && bestMatchObj.exactMatch == true) {
            var cur_rating = parseFloat(bestMatchObj.overallRating);
            // avoid unrated companies
            if (cur_rating !== 0) {
               total_matches_with_rating++;
               rating_sum += cur_rating;
            }
         }
         // invoking the callback when done with jobs requests
         if (total_company_requests == indeed_jobs_arr.length - 1) {
            var avg_company = Number((rating_sum / total_matches_with_rating).toFixed(2));
            callback(indeed_tot_jobs, avg_company);
         }
      });
   }
}

// clear glassdoor vars, and vars to calculate average company rating
function clear_glassdoor_vars() {
   rating_sum = 0.0;
   total_matches_with_rating = 0;
   total_company_requests = 0;
}

// handler function for Jobs Detail Page, passes html to both callbacks
function getJobsData(loc, successCallback, errorCallback) {
   var html = "<h1> Welcome to the Jobs page!</h1>" +
      "<div>" + JSON.stringify(indeed_jobs_array) + "</div";
   successCallback(html);
}

function getIndeedOptions(zip) {
   return "?publisher=9876703242051712" +
      "&q=" + indeed_query +
      "&l=" + zip +
      "&sort=" +
      "&radius=" + job_radius_miles +
      "&st=" +
      "&jt=" + job_type +
      "&start=" +
      "&limit=" + limit +
      "&fromage=" +
      "&filter=" +
      "&latlong=1" + /* always return latlong */
      "&co=us" + /* always in USA */
      "&chnl=" +
      "&userip=1.2.3.4" + /* dummy IP */
      "&useragent=Mozilla/%2F4.0%28Firefox%29" +
      "&v=2"; /* always v2 */
}

function getGlassdoorOptions(companyName) {
   return 't.p=114236&t.k=j1ERnurd9SI' +
      '&userip=0.0.0.0' +
      '&useragent=&format=json&v=1' +
      '&action=employers' +
      '&city=seattle&state=WA' +
      '&q=' + companyName;
}

/* CORS-anywhere API request */
function doCORSRequest(options, printResult) {
   var x = new XMLHttpRequest();
   x.open(options.method, cors_api_url + options.url);
   x.onerror = function () {
      console.log("An error occurred opening the request:");
   };
   try {
      x.onload = function() {
         return printResult(x.responseText);
      };
   } catch (err) {
      console.log("An error occurred loading the response");
   }

   if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   }

   try {
      x.send(options.data);
   } catch (err) {
      console.log("An error occured sending the request");
      console.log(cors_api_url + options.url);
   }
}

function get_stars(rating) {
   var str = "<div class='fa'>";
   var i = 1;
   while (i < avg_rating) {
      str += "<span class='fa-star'></span>";
      i++;
   }
   var temp_rating = avg_rating - i;
   if (temp_rating >= 0.51) {
      str += "<span class='fa-star'></span>";
   } else if (temp_rating >= 0.333) {
      str += "<span class='fa-star-half'></span>";
   }
   return str + "</div>";
}
