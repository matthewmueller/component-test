/**
 * Module Dependencies
 */

var debug = require('debug')('component-test:sauce');
var open = require('open')
var path = require('path');
var basename = path.basename;
var cwd = process.cwd();
var name = basename(cwd);
var Cloud = require('mocha-cloud')
var sum = require('sum-component');
var serve = require('../serve');
var tunnel = require('../tunnel');
var config = require('../config');
var mocha = require('mocha');
var Spec = mocha.reporters.Spec;
var Runner = require('events').EventEmitter;

/**
 * Expose `sauce`
 */

exports = module.exports = sauce;

/**
 * Trap SIGINT
 */

process.on('SIGINT', function(){
  process.nextTick(function(){
    process.exit();
  });
});

/**
 * Initialize `sauce`
 */

function sauce(opts, fn) {
  // add credentials
  var auth = opts.auth.split(':');
  var cloud = new Cloud(name, auth[0], auth[1]);
  var runner = new Runner();
  var reporter = new Spec(runner);
  var failures = [];

  // report when each test starts
  cloud.on('start', function(browser, res) {
    console.log('starting %s...', format(browser));
  })

  // report when each test finishes
  cloud.on('end', function(browser, res) {
    runner.emit('suite', { title: format(browser) });

    // Handle javascript exceptions
    if ('string' == typeof res) {
      console.error(res);
    } else {
      // Handle each test
      res.tests.forEach(function(test) {
        // TODO: don't hardcode speed
        test.slow = function() { return 2000 };

        if (test.err) {
          failures.push(test);
          var err = [test.err.message, test.err.stack].join('\n\n');
          runner.emit('fail', test);
          console.error(err);
        } else {
          runner.emit('pass', test);
        }
      });
    }

    runner.emit('suite end');
  });

  // set the concurrency
  cloud.concurrency(7);

  // add browsers
  var browsers = opts.browsers;
  browsers.forEach(function(browser) {
    browser = parse(browser);
    debug('adding browser %j', browser);
    cloud.browser(browser.name, browser.version, browser.platform);
  });

  // serve the test files and dependencies
  debug('serving the tests')
  serve(function(err, url, server) {
    if (err) return fn(err);
    debug('tests available on locally at: %s', url);
    var port = server.address().port;

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

        setTimeout(function(){
          process.exit(failures.length);
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

/**
 * Format browser string.
 *
 * @param {Object} b (browser)
 * @return {String}
 * @api private
 */

function format(b) {
  return b.browserName + ' ' + b.version + ' ' + b.platform;
}
