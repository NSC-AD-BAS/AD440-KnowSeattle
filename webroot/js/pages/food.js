function getFoodSummary(location, success, error) {
    $.ajax( {
         url: "food/summary",
         type:'GET',
         data: {location},
         success: function(data) {
             var html = "<li>Avg rating: <div class='fa'> "
                + getStars(data.averageRating)
                + "</div> ("
                + data.averageRating
                + ")</li><li>"
                + data.count
                + " within 1 mile</li>";
             success(html);
         },
         error: function(error){
            error("Unable to load yelp data.");
         }
      });
}

var wholeStar = "<span class='fa-star'></span>";
var halfStar = "<span class='fa-star-half'></span>";

function getStars(rating) {
    if (rating <= 0 || rating > 5)
        return "";
    else if (rating < 1)
        return halfStar;
    else
        return wholeStar + getStars(rating - 1);
}



function getFoodDetailData(location, success, error) { 
    $.ajax( {
         url: "food/detail",
         type:'GET',
         data: {location},
         success: function(data) {
             var headerColumns = ["Name","Rating"];
             var tableHeader = CreateTableHeader(headerColumns);
             var items = data.map(buildTableRow);
             var tableRows = items.reduce(function (acc, item) {
                 return acc + item;
             }, tableHeader);
             
             success("<table>" + tableRows + "</table>");
         },
         error: function(error){
            error("Unable to load yelp data.");
         }
      });
}

function CreateTableHeader(columnNames) {
    var tableHeaders = columnNames.map(function(columnName) {return "<th>" + columnName + "</th>"});
    var headerHtml = tableHeaders.reduce(function(acc, header) {return acc + header}, "");
    return "<tr>" + headerHtml + "</tr>";
}

function buildTableRow(business) {
    return "<tr><td><a href=\""
                    + business.url
                    + "\">"
                    + business.name 
                    + "</a></td><td><img src=\""
                    + business.rating_img_url_large
                    + "\"></td></tr>";
}

