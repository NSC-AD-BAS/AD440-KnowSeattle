function getData() {
$.ajax({
    url: "https://data.seattle.gov/resource/64yg-jvpt.json",
    type: "GET",
    data: {
        "$limit" : 5000,
        "$select" : "feature_desc",
        "$group" : "feature_desc"
    }
}).done(function (data) {
    document.getElementById("message").innerHTML = "Retrieved " + data.length + " records.";
    document.getElementById("results").innerHTML = JSON.stringify(data, null, 4);
    console.log(data);
}).fail(function (error) {
    alert("Error retrieving data: " + error);
    console.log(error);
});
}