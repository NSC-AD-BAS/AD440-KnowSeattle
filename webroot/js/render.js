//Global vars
var pages = ["Home", "Walk-Score", "Hospitals", "Parks", "Culture", "Jobs", "Schools", "Art", "Crime", "Property", "Concerts", "Food"];
var currentPage = pages[0];
var showMap = true;
var leftContentDiv = "left-content";

//basic breakpoint where map hides but nav remains ok
function mediaQuery(){
   var mq = window.matchMedia("(min-width: 1029px)");
   if(mq.matches){
      return true;
   }
}

//secondary breakpoint where nav should be hidden/displayed differently to avoid overlap with title
function mediaQueryNav(){
   var mq = window.matchMedia("(min-width: 490px)");
   if(mq.matches){
      return true;
   }else{
      return false;
   }
}

//Render functions
function render_nav() {
      var ul = "<ul>";
      for (var i = 0; i < pages.length; i++) {
         ul += "<li class='left' onclick='setFocus(this)'>" + linkify(pages[i]) + "</li>";
      }

      if (mediaQuery()) { //hide toggle map button if map is not currently visible at this width
         ul += "<li class='right'><a href='javascript:void(0)' onclick='toggle_map()'>Toggle Map</a></li>";
      }
      ul += "</ul>";
      if (mediaQueryNav()) {
         document.getElementById("nav").innerHTML = ul;
      } else {
      //TODO: Render dropdown / mobile formatted navigation when page loads <490px wide
         document.getElementById("nav").innerHTML = "dropdown Nav here";
      }
}

function render_page(name) {
   var str;
   currentPage = name;
   switch (name) {
      case "Home":
         render_tiles();
         return;
      case "Hospitals":
         str = getHospData(loc, true);
         break;
      case "Property":
         getPropertyData(loc,
           function(success) { update_div(leftContentDiv, success);},
           function(error)   { update_div(leftContentDiv, error); });
         str = "Loading.....";
         return;
      case "Parks":
         getParks(loc,
            function(success) { update_div(leftContentDiv, success);},
            function(error)   { update_div(leftContentDiv, error); });
         return;
      case "Culture":
         getCultureData(loc,
            function(success) { update_div(leftContentDiv, success);},
            function(error)   { update_div(leftContentDiv, error); });
         return;
      case "Schools":
         getSchoolsData(loc,
            function(success) { update_div(leftContentDiv, success);},
            function(error)   { update_div(leftContentDiv, error); });
         return;
      case "Walk-Score":
         getWalkScoreData(loc,
            function(success) { update_div(leftContentDiv, success);},
            function(error)   { update_div(leftContentDiv, error); });
         return;
      case "Jobs":
         getJobsData(loc,
            function(success) { update_div(leftContentDiv, success);},
            function(error)   { update_div(leftContentDiv, error); });
         return;
      case "Concerts":
         getConcertData(loc,
            function(success) { update_div(leftContentDiv, success);},
            function(error)   { update_div(leftContentDiv, error); });
         return;
      case "Art":
         getPublicArtData(loc,
            function(success) { update_div(leftContentDiv, success);},
            function(error)   { update_div(leftContentDiv, error); },
            true);
         return;
      case "Crime":
         getCrimeDetailData(loc,
            function(success) { update_div(leftContentDiv, success);},
            function(error)   { update_div(leftContentDiv, error); },
            true);
         return;
      case "Food":
         getFoodDetailData(loc,
            function(success) { update_div(leftContentDiv, success);},
            function(error)   { update_div(leftContentDiv, error);});
         return;
      default:
         str = "Hey, now we're going to render " + name;
         break;
   }
   update_div(leftContentDiv, str);
}

function update_div(div, html) {
   document.getElementById(div).innerHTML = html;
}

function render_tiles() {
   var tiles = "<div style='display: flex; flex-wrap: wrap'>";
   for (var i = 1; i < pages.length; i++) {     //Start at 1 to skip 'Home' tile
      var tile = "", page = pages[i].replace(" ", "");
      tile += "<a href='#" + page + "'>";
      tile += "<div class='tile " + page + "'><span class='" + get_icon(pages[i]) + "'></span>";
      tile += get_summary(pages[i]);
      tile += "</div></a>";
      tiles += "<strong>" + tile + "</strong>";
   }
   tiles += "</div>";
   var tilesHeader = "<p id=\"tilesHeader\">Information About Your Area</p>";
   document.getElementById(leftContentDiv).innerHTML = tilesHeader + tiles;
}

//Utility functions
function linkify(page) {
   page = page.replace(" ", "");
   return "<a href='#" + page + "'>" + page + "</a>";
}

function get_summary(page) {
   var sum = "&nbsp;" + page + "<br/><ul id=\"" + page + "_tile\">";
   switch (page) {
      case "Hospitals":
         sum += getHospSummary();
         break;
      case "Walk-Score":
         sum += "<li>Loading Walk-Score Data...</li>";

         getWalkScoreSummary(loc,
            function(success) {update_div("Walk Score_tile", success);},
            function(error)   {update_div("Walk Score_tile",  error); });
         break;
      case "Art":
         sum += "<li>Loading Art Data...</li>";
         getPublicArtSummary(loc,
            function(success) {update_div("Art_tile", success);},
            function(error)   {update_div("Art_tile",  error); });
         break;
      case "Culture":
         getCultureDataSummary(loc,
            function(success) {update_div("Culture_tile", success);},
            function(error)   {update_div("Culture_tile",  error); });
         break;
      case "Crime":
         sum += '<li>Loading Crime Data...</li>';
         getCrimeSummary(loc,
            function(success) {update_div("Crime_tile", success);},
            function(error)   {update_div("Crime_tile", error);  });
         break;
      case "Parks":
         sum += "<li>Loading Parks Data...</li>";
         getParksSummary(loc,
            function(success) {update_div("Parks_tile", success);},
            function(error)   {update_div("Parks_tile", error);  });
         break;
      case "Concerts":
         sum += "<li>Loading Concert Data...</li>";
         getConcertData(loc,
            function(success) {update_div("Concerts_tile", success);},
            function(error)   {update_div("Concerts_tile", error);  });
         break;
      case "Jobs":
         sum += '<div class=\"loader\"></div>';
         getJobsSummary(loc, function(totalJobs, avgCompany) {
            $("#Jobs_tile").hide();
            var html = "<li>Fulltime Jobs: " + totalJobs + "</li>" +
               "<li>Avg Company: " + get_stars(avgCompany) +
               "&nbsp;(" + avgCompany + ")</li>";
            document.getElementById("Jobs_tile").innerHTML = html;
            $("#Jobs_tile").fadeIn("slow", function(){});
         });
         break;
      case "Property":
         sum+= '<li>Loading Data...</li>';
         getPropertySummary(loc,
            function(success) {update_div("Property_tile", success);},
            function(error)   {update_div("Property_tile", error);});
         break;
      case "Food":
         sum += '<li>Loading Data...</li>';
         getFoodSummary(loc,
            function(success) {update_div("Food_tile", success);},
            function(error)   {update_div("Food_tile", error);  });
         break;
      case "Schools":
         sum += '<li>Loading Data...</li>';
         getSchoolsSummary(loc,
            function(success) {update_div("Schools_tile", success);},
            function(error)   {update_div("Schools_tile", error); }, false);
         break;
      default:
         sum += "<li>Pertinent Point</li>" +
                "<li>Salient Stat</li>";
         break;
   }
   return sum + "</ul>";
}

function get_icon(page) {
   var icon = "fa ";
   switch (page) {
      case "Hospitals":
         icon += "fa-ambulance fa-2x";
         break;
      case "Crime":
         icon += "fa-balance-scale fa-2x";
         break;
      case "Food":
         icon += "fa-yelp fa-2x";
         break;
      case "Walk-Score":
         icon += "fa-map-o fa-2x";
         break;
      case "Parks":
         icon += "fa-tree fa-2x";
         break;
      case "Culture":
         icon += "fa-smile-o fa-2x";
         break;
      case "Property":
         icon += "fa-home fa-2x";
         break;
      case "Schools":
         icon += "fa-university fa-2x";
         break;
      case "Jobs":
         icon += "fa-money fa-2x";
         break;
      case "Concerts":
         icon += "fa-music fa-2x";
         break;
      case "Art":
         icon += "fa-picture-o fa-2x";
         break;
      default:
         icon += "fa-question-circle-o fa-5";
         break;
   }
   return icon;
}

function toggle_map() {
   showMap = !showMap;
   leftContentDiv = showMap ? "left-content" : "left-content-full";
   document.getElementById(showMap ? "hide_map" : "show_map").setAttribute("id", showMap ? "show_map" : "hide_map");
   document.getElementById(showMap ? "left-content-full" : "left-content").setAttribute("id", showMap ? "left-content" : "left-content-full");
   document.getElementById(showMap ? "right-content-full" : "right-content").setAttribute("id", showMap ? "right-content" : "right-content-full");
}

function setFocus(elem) {
    var previous = document.getElementById('nav_active');
    if (previous) {
        previous.id = "";
    }
    elem.id = 'nav_active';
    // clear markers from map on change
    deleteMarkers();
}

window.onhashchange = function () {
   var data = document.location.hash.substr(1);
   !!data ? render_page(data) : render_page(pages[0]);
};
