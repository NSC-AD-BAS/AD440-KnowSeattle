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
        $response = do_curl($url);
        if ($response[0] != 200) {
            return_error($response);
        }
        echo $response[1];
    }

    function getConcertData() {
        $loc = $_GET["loc"];    //Get the location object
        $lat = $loc['lat']; $lon = $loc['lng']; $zip = $loc['zip'];
        $key = "k5dywsuqf9vaexvg5xczcspf";
        $url = "http://api.jambase.com/events?zipCode=" . $zip . "&radius=0&page=0&api_key=" . $key;
        $response = do_curl($url);
        if ($response[0] != 200) {
            return_error($response);
        }
        echo $response[1];
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
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $response = [$http_status, $result];
        // Closing
        curl_close($ch);
        return $response;
    }

    function return_error($response) {
        $http_code = $response[0];
        $message   = $response[1];
        header('HTTP/1.1 ' . $http_code . ' Returned from ' . $func);
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => $response[1], 'code' => $http_code)));
    }
?>
