/**
 * Module Dependencies
 */

var fs = require('fs');
var read = fs.readFileSync;
var exists = fs.existsSync;
var path = require('path');
var glob = require('glob');
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var express = require('express');
var cheerio = require('cheerio');
var cwd = process.cwd();
var testglob = join(cwd, 'test', '*.js');
var mochadir = join(__dirname, '../node_modules/mocha/');
var app = express();
var server = require('http').createServer(app);
var debug = require('debug')('component-test:serve');

/**
 * Assets already loaded
 */

var loaded = [];

/**
 * Load the template
 */

var template = read(join(__dirname, 'client/mocha.html'), 'utf8');
var $ = cheerio.load(template);

/**
 * Parse suite title
 */

var title = 'mocha tests';
try {
  title = require(join(cwd, 'component.json')).name + ' tests';
} catch (e) {}
$('title').text(title);

/**
 * Expose `serve`
 */

module.exports = function(fn) {
  debug('starting server');
  server.listen(function() {
    var addr = server.address();
    var url = 'http://localhost:' + addr.port;
    debug('started server: %s', url);
    fn(null, url, server);
  });
};

/**
 * Serve the build files
 */

app.use(express.favicon());
app.use(express.static(join(__dirname, 'client')));
app.use(express.static(join(cwd, 'build')));
app.use(express.static(join(cwd, 'test'), { index: 'no thanks' }));

/**
 * Serve the mocha dependencies directly from
 * the mocha npm module
 */

app.get('/mocha.js', function(req, res) {
  res.sendfile(join(mochadir, 'mocha.js'));
});

app.get('/mocha.css', function(req, res) {
  res.sendfile(join(mochadir, 'mocha.css'));
});

/**
 * Build the main index file each time
 */

app.get('/*', ensureBuildDir, function(req, res, next) {
  // fetch all the test files
  glob(testglob, function(err, assets) {
    if (err) return next(err);
    // add in the assets
    assets.forEach(function(asset) {
      if (~loaded.indexOf(asset)) return;
      loaded.push(asset);

      var base = '/' + basename(asset);

      switch(extname(base)) {
        case '.js':
          return $('#run').before(script(base));
        case '.css':
          return $('head').append(link(base));
      }
    });

    res.send($.html());
  });
});

/**
 * Middleware to ensure the build
 * directory exists
 *
 * @todo make more generic
 */

function ensureBuildDir(req, res, next) {
  if (exists(join(cwd, 'build/'))) return next();

  $('script').remove();
  // less scrubby error page.
  $('body').html('<center><h2>no <code>build/</code> dir found. please compile files before running the tests</h2></center>');
  res.send($.html());
}

/**
 * Create a <link> node
 */

function link(href) {
  return $('<link>').attr({ rel: 'stylesheet', href: href });
}

/**
 * Create a <script> node
 */

function script(src) {
  return $('<script>').attr({ src: src });
}
