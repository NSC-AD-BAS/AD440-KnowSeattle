// CORS bypass
var cors_api_url = 'https://knowseattle.com/cors/';

function getCorsData(jsonOpts, success, fail) {
   var x = new XMLHttpRequest();  var msg = "";
   x.open(jsonOpts.method, cors_api_url + jsonOpts.url);
   x.onerror = function () {
      console.log("An error occurred opening the request:");
   };
   try {
      x.onload = function() {
         return success(x.responseText);
      };
   } catch (err) {
      msg = "An error occurred loading the response.  Error: " + err;
      fail(msg);
      console.error(msg);
   }

   //TODO: is this ever used?
   if (/^POST/i.test(jsonOpts.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   }

   try {
      x.setRequestHeader('x-requested-with', 'XMLHTTPREQUEST');
      x.send(jsonOpts.data);
   } catch (err) {
      msg = "An error occurred sending the request.  Error: " + err;
      console.error(msg);
      console.error(cors_api_url + jsonOpts.url);
   }
}
