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

// Indeed JSON to avoid redundant API requests
var indeed_jobs_json;

// CORS bypass
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

function getJobsDefault() {
   return "<li>Full-time Jobs: ???</li><li>Avg Company: ???</li>";
}

function getJobsSummary(loc, callback) {
   if (!loc.zip) {
       return getJobsDefault();
   }
   // console.log(loc.zip);
   var indeed_options = getIndeedOptions(loc.zip);
   var indeed_total_jobs = 0;
   doCORSRequest({
      method: 'GET',
      url: "http://api.indeed.com/ads/apisearch" + indeed_options,
      data: ""
   }, function printResult(result) {
      indeed_jobs_json = xmlToJSON.parseString(result);
      indeed_total_jobs = indeed_jobs_json.response[0].totalresults[0]._text;
      console.log(indeed_total_jobs);
      callback(indeed_total_jobs);
   });
}

function getJobsData(loc, successCallback, errCallback) {
    successCallback("Welcome to the Jobs page!");
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

/* CORS-anywhere API request */
function doCORSRequest(options, printResult) {
   var x = new XMLHttpRequest();
   x.open(options.method, cors_api_url + options.url);
   x.onload = x.onerror = function() {
      return printResult(x.responseText);
   };

   if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   }
   x.send(options.data);
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
