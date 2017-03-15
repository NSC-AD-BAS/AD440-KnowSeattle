#Continuous Integration Tests for KnowSeattle
##Travis CI
Docs: https://docs.travis-ci.com/user/for-beginners
####Master branch build status
![](https://travis-ci.org/GelLiNN/MovingHelper.svg?branch=master)
###Running the tests locally
1. Make sure the server is built and running on localhost:8888
2. Run console errors test:
   		`./node_modules/phantomjs/bin/phantomjs tests/console-errors-test.js`
3. Run dummy test:
        `./node_modules/jshint/bin/jshint tests/dummyTest.js`

These tests are running on merge with Travis CI.
