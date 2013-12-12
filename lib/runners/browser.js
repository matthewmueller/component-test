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
 * Normalize browser names
 */

function normalize(name) {
  if (!name) return;
  name = name.toLowerCase();
  if (name === 'chrome') return 'google chrome';
  if (name === 'ie') return 'internet explorer';
  return name;
}

/**
 * Initialize `run`
 */

function run(name, fn) {
  // serve the test suite
  serve(function(err, url) {
    if (err) return fn(err);
    console.log('running tests on: %s', url);
    open(url, normalize(name));
  });
}