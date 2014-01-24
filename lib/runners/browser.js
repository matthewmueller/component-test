/**
 * Module Dependencies
 */

var debug = require('debug')('component-test:browser');
var serve = require('../serve');
var tunnel = require('../tunnel');
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
 * @param {Object} options
 * @param {Function} fn
 */

function run(browser, options, fn) {
  options = options || {};

  // serve the test suite
  serve(function(err, url, server) {
    if (err) return fn(err);
    browser = normalize(browser);
    debug('opening browser: %s', browser || 'default');

    // open immediately if no tunnel
    if (!options.tunnel) return open(url, browser);

    // create a tunnel
    var port = server.address().port;
    tunnel(port, function(err, url) {
      if (err) return fn(err);
      open(url, browser);
    })
  });
}
