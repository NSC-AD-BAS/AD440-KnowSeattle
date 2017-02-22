<?php

//gets data from walkscore 
// this php page is called by js functions
// lat, lon and address are passed from js

function getWalkScore($lat, $lon, $address)
{
    $address = urlencode($address);
    $url = "http://api.walkscore.com/score?format=json";
    $url .= "&lat=$lat&lon=$lon&wsapikey=10284fa9f60a76d6175a7fb5d834ad20";
    $str = @file_get_contents($url);
    return $str; 
    } 

$lat = $_GET['lat']; 
$lon = $_GET['lon'];
$address = stripslashes($_GET['address']);
$json = getWalkScore($lat,$lon,$address);
echo $json;

?> 