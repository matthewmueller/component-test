/**
 * Module Dependencies
 */

var serve = require('../serve');
var cp = require('child_process');
var spawn = cp.spawn;
var path = require('path');
var join = path.join;
var cwd = process.cwd();
var phantom = join(__dirname, '../../node_modules/.bin/mocha-phantomjs');

/**
 * Expose `run`
 */

module.exports = run;

/**
 * Initialize `run`
 */

function run(fn) {
  var args = process.argv.slice(3);

  // serve the test suite
  serve(function(err, url, server) {
    if (err) return fn(err);
    args = args.concat([url]);
    var mocha = spawn(phantom, args);

    mocha.on('error', fn)

    mocha.on('close', function(code) {
      process.exit(code);
    });

    mocha.stdout.pipe(process.stdout);
    mocha.stderr.pipe(process.stderr);
  });
}
