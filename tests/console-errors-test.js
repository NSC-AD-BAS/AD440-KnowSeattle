/*
* Author: Kellan Nealy
* This test navigates the site and fails if there are console errors
*
var webdriver = require('selenium-webdriver'), driver;

driver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'firefox',
    'platform': 'VISTA',
    'version': 'latest',
    'client_key': process.env.TESTINGBOT_KEY,
    'client_secret': process.env.TESTINGBOT_SECRET,
    'name': (process.env.TRAVIS_JOB_ID ? ("Travis Build " + process.env.TRAVIS_JOB_ID) : "Simple Test")
  }).
  usingServer("http://" + testingbotKey + ":" + testingbotSecret +
              "@hub.testingbot.com/wd/hub").
  build();

driver.get('https://www.google.com');

driver.getTitle().then(function (title) {
    console.log("title is: " + title);
});

driver.quit();*/

var url = "http://localhost:8888"
var page = require('webpage').create();
var t = Date.now();
console.log('testing page at: ' + url);

page.onConsoleMessage = function(msg) {
    console.log('Page title is ' + msg);
};
page.open(url, function(status) {
    if (status !== 'success') {
        console.log('FAIL to load the address');
    } else {
        t = Date.now() - t;
        console.log('Loading ' + url);
        console.log('Loading time ' + t + ' msec');
        //evaluate load time for the page
        page.evaluate(function() {
            console.log(document.title);
        });
    }
    // Exit phantomjs after tests
    phantom.exit();
});
