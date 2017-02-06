var eyes = require('eyes');
var http = require('http');
var https = require('https');
var fs = require('fs');
//var xml2js = require('xml2js');
//var parser = new xml2js.Parser();

gethousingprices('2114 Bigelow Ave');

function gethousingprices(street, documentid) {
	var newstreet = street.replace(/ /g, '+');
	
	var options = {
		host: 'www.zillow.com',
		port: 80,
		path: '/webservice/GetSearchResults.htm?zws-id=X1-ZWz19eifb82423_85kuc&address=' + newstreet + '&citystatezip=Seattle%2C+WA',
		method: 'GET'
	};
	
	var data = "", price = "";
	
	http.get(options, function(res) {
		res.on('data', function(dataresponse) { data += dataresponse.toString(); });
		res.on('end', function() {
			//console.log('data', data);
			//parser.parseString(data, function(err, result) {
			//	console.log('FINISHED', err, result);
			//});
			
			var neighborhood =(data.split("<region name=\"")[1]).split("\" id=")[0];
			
			price = (data.split("<zindexValue>")[1]).split("</zindexValue>")[0];
			//console.log("The housing costs for the " + neighborhood + " neighborhood is: " + price);
			document.getElementById(documentid).innerHTML = ("The housing costs for the " + neighborhood + " neighborhood is: " + price);
			//return price;
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

