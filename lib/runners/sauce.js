/**
 * Module Dependencies
 */

var debug = require('debug')('component-test:sauce');
var open = require('open')
var Canvas = require('term-canvas');
var GridView = require('mocha-cloud-grid-view');
var path = require('path');
var basename = path.basename;
var cwd = process.cwd();
var name = basename(cwd);
var Cloud = require('mocha-cloud')
var serve = require('../serve');
var tunnel = require('../tunnel');
var config = require('../config');

/**
 * Initialize the canvas
 */

var canvas = new Canvas(50, 200);
var ctx = canvas.getContext('2d');

/**
 * Trap SIGINT
 */

process.on('SIGINT', function(){
  ctx.reset();
  process.nextTick(function(){
    process.exit();
  });
});

/**
 * Expose `sauce`
 */

module.exports = sauce;

/**
 * Initialize `sauce`
 */

function sauce(opts, fn) {
  // add credentials
  var auth = opts.auth.split(':');
  var cloud = new Cloud(name, auth[0], auth[1]);

  // add browsers
  var browsers = opts.browsers;
  browsers.forEach(function(browser) {
    browser = parse(browser);
    debug('adding browser %j', browser);
    cloud.browser(browser.name, browser.version, browser.platform);
  });

  // set up grid
  var grid = new GridView(cloud, ctx);
  grid.size(canvas.width, canvas.height);

  // serve the test files and dependencies
  debug('serving the tests')
  serve(function(err, url) {
    if (err) return fn(err);
    debug('tests available on locally at: %s', url);
    var port = url.slice(url.lastIndexOf(':') + 1);

    // establish a local tunnel to allow saucelabs
    // to access our server
    debug('creating the tunnel');
    tunnel(port, function(err, url) {
      if (err) return fn(err);
      debug('tunnel running at: %s', url);

      // add the url for saucelabs to hit
      cloud.url(url);

      // start the tests
      debug('starting the tests on saucelabs');
      cloud.start(function(err){
        if (err) return fn(err);
        debug('finished tests on saucelabs');

        grid.showFailures();
        setTimeout(function(){
          process.exit(grid.totalFailures());
        }, 100);
      });
    });
  });
}

/**
 * Tiny browser parser to disambiguate the browser string
 *
 * @param {String} str
 * @return {Array}
 */

function parse(str) {
  var toks = str.split(/\s+/);
  var name = [];
  var version = [];
  var platform = [];
  var pastName = false;
  var pastVersion = false;

  toks.forEach(function(tok) {
    if (!pastVersion && /[0-9.]+/.test(tok)) {
      version.push(tok);
      pastName = true;
      pastVersion = true;
    } else if(!pastName) {
      name.push(tok);
    } else {
      platform.push(tok);
    }
  });

  var out = {};
  out.name = name.join(' ');
  out.version = version.join(' ');
  out.platform = platform.join(' ');

  return out;
};
