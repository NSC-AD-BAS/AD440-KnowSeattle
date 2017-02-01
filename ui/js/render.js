//global vars
var pages = ["Home", "Culture", "Crime", "Food", "Walk Score", "Parks", "Hospitals", "Transit"];
var currentPage = pages[0];

//Render functions
function render_nav() {
   var ul = "<ul>";
   for (var i = 0; i < pages.length; i++) {
      ul += "<li class='left'>" + linkify(pages[i]) + "</li>";
   }
   ul += "</ul>";
   document.getElementById("nav").innerHTML = ul;
}

function render_tickboxes() {
   var str = "";
   for (var i = 0; i < pages.length; i++) {
      str += "<input type=radio id=\"" + pages[i] + "\" >" + pages[i] + "<br/>";
   }
   document.getElementById("tickboxes").innerHTML = str;
}

function render_page(name) {
   var str;
   currentPage = name;
   switch (name) {
      case "Home":
         render_tiles();
         return;
      case "Crime":
         str = getCrimeData(null, null);
         break;
      case "Hospitals":
         str = getHospData(loc, true);
         break;
      case "Culture":
         str = getCultureData(loc);
         break;
      case "Transit":
         str = getTransitData(loc);
         break;
      default:
         str = "Hey, now we're going to render " + name;
         break;
   }
   document.getElementById("left-content").innerHTML = str;
}

function render_tiles() {
   //Initialize live tile data, if applicable
   getHospData(loc, false);
   var tiles = "<div style='display: flex; flex-wrap: wrap'>";
   for (var i = 1; i < pages.length; i++) {     //Start at 1 to skip 'Home' tile
      var tile = "", page = pages[i].replace(" ", "");
      tile += "<a href='#' onclick='render_page(\"" + page +"\"); return false;'>";
      tile += "<div class='tile " + page + "'><span class='" + get_icon(pages[i]) + "'></span>";
      tile += get_summary(page);
      tile += "</div></a>";
      tiles += tile;
   }
   tiles += "</div>";
   document.getElementById("left-content").innerHTML = tiles;
}

//Utility functions
function linkify(text) {
   return "<a href='#' onclick='render_page(text); return false;'>" + text + "</a>";
}

function get_summary(page) {
   var sum = "&nbsp;" + page + "<br/><ul>";
   switch (page) {
      case "Hospitals":
         sum += get_hospital_summary();
         break;
      case "WalkScore":
         sum += "<li>Walk: 87</li>" +
               "<li>Bike: 79</li>" +
               "<li>Transit: 83</li>";
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
      case "Walk Score":
         icon += "fa-map-o fa-2x";
         break;
      case "Parks":
         icon += "fa-tree fa-2x";
         break;
      default:
         icon += "fa-question-circle-o fa-5";
         break;
   }
   return icon;
}
