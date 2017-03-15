/*
* Author: Kellan Nealy
* This test navigates the site and fails if there are console errors
*/

var webdriver = require('selenium-webdriver'), driver;
var host = 'http://localhost:8888';

driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

console.log("Starting Selenium Test: getting KnowSeattle homepage..");
console.log("Host: " + host);

driver.get(host);

driver.getTitle().then(function (title) {
    console.log("title is: " + title);
});

driver.quit();
