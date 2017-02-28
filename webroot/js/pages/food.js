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

