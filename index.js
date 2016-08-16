'use strict';

var extend = require('extend-shallow');
var spawn = require('child_process').spawn;

/**
 * Exposes the `background` object
 */

var background = module.exports = {};

/**
 * Start a background script and send the new child process the given options before disconnecting from the child process.
 *
 * ```js
 * background.start('worker.js', { timeout: 5000 });
 * ```
 * @param  {String} `fp` filepath to the background script
 * @param  {Object} `options` Additional options to send to the child process
 * @api public
 */

background.start = function(fp, options) {
  var opts = extend({}, options);
  var stdio = opts.stdio || ['ignore', 'ignore'];

  var child = spawn(process.execPath, [fp].concat(opts.args || []), {
    stdio: ['ipc'].concat(stdio),
    detached: true
  });

  child.on('exit', function(code) {
    if (code === 0) return;
    console.error(`Child exited unexpectedly with exit code ${code}`);
  });

  child.send(JSON.stringify({options: opts}));
  child.disconnect();
  child.unref();
};

/**
 * Use in a child script to know when to start running. The callback function will recieve a possible `Error` object and an `options` object.
 * This is a wrapper for doing `process.on('message', ...)`. This is not something that's required since the runner process will not wait
 * for a response and disconnect. This is a way to send options from the runner to the background script.
 *
 * ```js
 * background.ready(function(err, options) {
 *   if (err) return;
 *   // do something
 * });
 * ```
 * @param  {Function} `cb` Callback function that will be executed when the options are recieved from the runner.
 * @api public
 */

background.ready = function(cb) {
  var started = false;

  process.on('message', function (data) {
    if (started) return;
    started = true;

    try {
      data = JSON.parse(data);
      cb(null, data.options || {});
    } catch(err) {
      cb(err);
    }
  });
};
