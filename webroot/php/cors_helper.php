<?php
    $func = $_GET["f"];

    // Add other helper function calls here
    if ($func == "walkscore") {
        getWalkScore();
    } else if ($func == "concerts") {
        getConcertData();
    }

    /*
     * Helper function implementations
     */
    function getWalkScore() {
        $loc = $_GET["loc"];    //Get the location object
        $lat = $loc['lat']; $lon = $loc['lng'];
        $key = "10284fa9f60a76d6175a7fb5d834ad20";
        $url = "http://api.walkscore.com/score?format=json&lat=". $lat ."&lon=" . $lon . "&transit=1&bike=1&wsapikey=" . $key;
        echo do_curl($url);
    }

    function getConcertData() {
        $loc = $_GET["loc"];    //Get the location object
        $lat = $loc['lat']; $lon = $loc['lng']; $zip = $loc['zip'];
        $key = "k5dywsuqf9vaexvg5xczcspf";
        $url = "http://api.jambase.com/events?zipCode=" . $zip . "&radius=0&page=0&api_key=" . $key;
        echo do_curl($url);
    }

    //Utility functions
    function do_curl($url) {
        //  Initiate curl
        $ch = curl_init();
        // Disable SSL verification
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        // Will return the response, if false it print the response
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // Set the url
        curl_setopt($ch, CURLOPT_URL,$url);
        // Execute
        $result=curl_exec($ch);
        // Closing
        curl_close($ch);
        return $result;
    }
?>
