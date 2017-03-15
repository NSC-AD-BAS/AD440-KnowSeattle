#!/bin/bash
node server.js &
sleep 2
./node_modules/phantomjs/bin/phantomjs tests/console-errors-test.js
