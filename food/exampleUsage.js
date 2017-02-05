var food = require('./food');

//Example usage
food.getFoodData(47.51, -122.25, 3, function(error, data) {
    if(error) {
        console.log('Error:\n' + error);
    }
    else {
        console.log(data);
    }
});