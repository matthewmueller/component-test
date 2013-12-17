/**
 * Module Dependencies
 */

var debug = require('debug')('component-test:browser');
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
 *
 * @param {String} browser
 * @param {Function} fn
 */

function run(browser, fn) {
  // serve the test suite
  serve(function(err, url) {
    if (err) return fn(err);
    browser = normalize(browser);
    debug('opening browser: %s', browser);
    open(url, browser);
  });
}
