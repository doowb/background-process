'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var background = require('../');

// create some file logs to capture stdout and stderr streams from the worker
mkdirp.sync('logs');
var logs = path.join.bind(path, __dirname, 'logs');

var stdout = fs.openSync(logs('stdout.txt'), 'a');
var stderr = fs.openSync(logs('stderr.txt'), 'a');

// start the worker and pass options
background.start('worker.js', {
  stdio: [stdout, stderr],
  timeout: 5000
});

// the runner is finished so exit
process.exit();
