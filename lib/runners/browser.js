/**
 * Module Dependencies
 */

var serve = require('../serve');
var open = require('open');

/**
 * Expose `run`
 */

module.exports = run;

/**
 * Initialize `run`
 */

function run(fn) {
  // serve the test suite
  serve(function(err, url) {
    if (err) return fn(err);
    console.log('running tests on: %s', url);
    open(url);
  });
}

