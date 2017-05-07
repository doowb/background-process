'use strict';

require('mocha');
var fs = require('fs');
var del = require('delete');
var path = require('path');
var assert = require('assert');
var mkdirp = require('mkdirp');
var background = require('../');

var fixtures = path.join.bind(path, __dirname, 'fixtures');
var actual = path.join.bind(path, __dirname, 'actual');

describe('background-process', function() {
  beforeEach(mkdirp.bind(mkdirp, actual()));
  afterEach(del.bind(del, actual()));

  it('should return the child process id', function() {
    this.timeout(10000);
    var stdout = fs.openSync(actual('stdout.txt'), 'a');
    var stderr = fs.openSync(actual('stderr.txt'), 'a');

    // start the worker and pass options
    const childPid = background.start(fixtures('worker.js'), {
        stdio: [stdout, stderr]
    });

    if (typeof(childPid) !== Number || !childPid) {
        console.log('Child ');
    }
  });

  it('should export an object', function() {
    assert(background);
    assert.equal(typeof background, 'object');
  });

  it('should run a worker script', function(cb) {
    this.timeout(10000);
    var stdout = fs.openSync(actual('stdout.txt'), 'a');
    var stderr = fs.openSync(actual('stderr.txt'), 'a');

    // start the worker and pass options
    background.start(fixtures('worker.js'), {
      stdio: [stdout, stderr],
      timeout: 1000
    });

    setTimeout(function() {
      var contents = fs.readFileSync(actual('stdout.txt'), 'utf8');
      assert.equal(contents, 'doing something for the specified amount of time\n');
    }, 500);

    setTimeout(function() {
      var contents = fs.readFileSync(actual('stdout.txt'), 'utf8');
      assert.equal(contents, 'doing something for the specified amount of time\nfinished doing something\n');
      cb();
    }, 2000);
  });
});
