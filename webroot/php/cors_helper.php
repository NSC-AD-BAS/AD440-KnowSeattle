<?php
    $func = $_GET["f"];

    // Add other helper function calls here
    if ($func == "walkscore") {
        getWalkScore();
    }

    /*
     * Helper function implementations
     */
    function getWalkScore() {
        $loc = $_GET["loc"];    //Get the location object
        //print_r($loc);        //See the fields in the object
        $lat = $loc['lat']; $lon = $loc['lng'];
        $key = "10284fa9f60a76d6175a7fb5d834ad20";
        $url = "http://api.walkscore.com/score?format=json&lat=". $lat ."&lon=" . $lon . "&transit=1&bike=1&wsapikey=" . $key;
        echo do_curl($url);
    }

    //other helper functions go here...
    //function getCORSData() {...}

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
