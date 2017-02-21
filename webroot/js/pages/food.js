function getFoodSummary(location, callback) {
    $.ajax( {
         url: "food/summary",
         type:'GET',
         data: {location},
         success: function(data) {
             var html = "<li>Stars: "
                + data.averageRating
                + "</li><li>"
                + data.count
                + " Eateries</li><li><a href='"
                + data.url
                + "'>Goto Yelp</a></li>";
             callback(null, {html: html, link: data.url });
         },
         error: function(error){
            callback(error);
         }
      });
}