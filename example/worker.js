'use strict';

var background = require('../');
background.ready(function(err, options) {
  if (err) return console.error(err);
  console.log(options);
  console.log('doing something for the specified amount of time');

  var start = new Date();
  setTimeout(function() {
    console.log('finished doing something after', (new Date()) - start);
    process.exit();
  }, options.timeout);
});
