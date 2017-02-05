module.exports.aggregate = function(data) {
    var count = 0;
    var countByRating = data.reduce(function(aggregateStars, business) {
        var rating = business.rating.toString();
        count++;
        if(rating in aggregateStars) {
            aggregateStars[rating]++;
        }
        else {
            aggregateStars[rating] = 1;
        }
        return aggregateStars;
    },
    {});
    return countByRating;
};