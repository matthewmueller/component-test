/**
 * Module Dependencies
 */

var serve = require('./serve');
var open = require('open');

/**
 * Expose `browser`
 */

module.exports = browser;

/**
 * Initialize `browser`
 */

function browser(files, options, fn) {
  // serve the test suite
  serve(function(err, url) {
    if (err) return fn(err);
    console.log('running tests on: %s', url);
    open(url);
  });
}

