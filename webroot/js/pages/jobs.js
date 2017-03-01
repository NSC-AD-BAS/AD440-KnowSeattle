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

// Stats
var jobs_in_area;
var avg_company_rating;
var industry_popularity = new Map();

// CORS bypass
var cors_api_url = 'https://knowseattle.com/cors/';

function getJobsDefault() {
   return "<li>Full-time Jobs: ???</li><li>Avg Company: ???</li>";
}

function getJobsSummary(loc, callback) {
   // clear vars to create clean requests system
   clear_jobs_vars();
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
      add_indeed_cache(indeed_jobs_array);
      getGlassdoorCompanies(indeed_total_jobs, indeed_jobs_array, callback);
   });
}

function getGlassdoorCompanies(indeed_tot_jobs, indeed_jobs_arr, callback) {

   for (var i = 0; i < indeed_jobs_arr.length; i++) {
      var jobTitle = indeed_jobs_arr[i].jobtitle[0]._text;
      var companyName = indeed_jobs_arr[i].company[0]._text;
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
            glassdoor_companies.push(bestMatchObj);
            add_glassdoor_cache(glassdoor_companies);

            // Count industries, skipping missing/empty industries
            if (bestMatchObj.industry && bestMatchObj.industry !== "") {
                if (industry_popularity.has(bestMatchObj.industry)) {
                    // Industry key exists
                    var count = industry_popularity.get(bestMatchObj.industry);
                    industry_popularity.set(bestMatchObj.industry, count + 1);
                } else {
                    // Industry key doesn't exist
                    industry_popularity.set(bestMatchObj.industry, 1);
                }
            }

            var cur_rating = parseFloat(bestMatchObj.overallRating);
            // avoid unrated companies
            if (cur_rating !== 0) {
               total_matches_with_rating++;
               rating_sum += cur_rating;
            }
         }
         // invoking the callback when done with jobs requests
         if (total_company_requests == indeed_jobs_arr.length - 1) {
            jobs_in_area = indeed_tot_jobs;
            avg_company_rating = Number((rating_sum / total_matches_with_rating).toFixed(2));
            callback(jobs_in_area, avg_company_rating);
         }
      });
   }
}

// clear glassdoor vars, indeed vars,
// and vars to calculate average company rating.
function clear_jobs_vars() {
   rating_sum = 0.0;
   total_matches_with_rating = 0;
   total_company_requests = 0;
   indeed_total_jobs = 0;
   indeed_jobs_json = null;
   indeed_jobs_array = null;
   avg_rating = null;
   total_company_requests = 0;
   total_companies_recieved = 0;
   industry_popularity = new Map();
}

// handler function for Jobs Detail Page, passes html to both callbacks.
// UPDATE: now supports async calling from anywhere in KnowSeattle.
function getJobsData(loc, successCallback, errorCallback) {

    // fancy loader animation ;p
    $("#left-content").html('<div class=\"detail_loader\"></div>');

    getJobsSummary(loc, function(totalJobs, avgCompany) {
       $("#left-content").hide();

       var jobs = indeed_jobs_array;
       var html = "";
       // Stats in this area
       html += "<h1>Jobs In This Area:</h1>";
       html += "<span>Total Jobs: " + jobs_in_area + "</span><br />";
       html += "<span>Average Company Rating: " + avg_company_rating + "</span>";
       // Jobs per Industry (this can be reduced to show less industries)
       // This sorts industry popularity by keys (industries), don't think you can sort by value (count)
       var industry_popularity_sort = new Map([...industry_popularity.entries()].sort());
       html += "<h1>Industries In This Area:</h1>";
       html += "<div>";
       html +=     "<table>";
       html +=         "<tr>";
       html +=             "<th>Industry</th>";
       html +=             "<th>Job Count</th>";
       html +=         "</tr>";
       industry_popularity.forEach(function(count, industry) {
           html +=     "<tr>";
           html +=         "<td>" + industry + "</td>";
           html +=         "<td>" + count + "</td>";
           html +=     "</tr>";
       });
       html +=     "</table>";
       html += "</div>";

       // Jobs
       html += "<h1>All Jobs & Companies:</h1>";
       html += "<div>";
       html +=     "<table>";
       html +=         "<tr>";
       html +=             "<th>Job Title</th>";
       html +=             "<th>Company</th>";
       html +=         "</tr>";
       jobs.forEach(function(job) {
           var job_lat = job.latitude[0]._text;
           var job_long = job.longitude[0]._text;
           html +=     "<tr>";
           html +=         "<td>";
           html +=             "<a href=\"" + job.url[0]._text +"\">" + job.jobtitle[0]._text + "</a>";
           html +=         "</td>";
           html +=         "<td>";
           html +=             job.company[0]._text;
           html +=         "</td>";
           html +=     "</tr>";
           // If you want to use pinpoints in UI
           // document.getElementById('pins').checked
           if (true) {
               var gmap = get_gmap();
               var marker = new google.maps.Marker({
                   position: new google.maps.LatLng(job_lat, job_long),
                   map: gmap,
                   title: 'job',
               });
           }
       });
       html +=     "</table>";
       html += "</div>";
       successCallback(html);

       $("#left-content").fadeIn("slow", function(){});
    });
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
      x.setRequestHeader('x-requested-with', 'XMLHTTPREQUEST');
   } catch (err) {
      console.log("An error occured sending the request");
      console.log(cors_api_url + options.url);
   }
}
