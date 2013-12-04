/**
 * Module Dependencies
 */

var fs = require('fs');
var read = fs.readFileSync;
var path = require('path');
var glob = require('glob');
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var express = require('express');
var cheerio = require('cheerio');
var cwd = process.cwd();
var mochadir = join(__dirname, '../node_modules/mocha/');
var app = express();
var server = require('http').createServer(app);

/**
 * Assets already loaded
 */

var loaded = [];

/**
 * Load the template
 */

var template = read(join(__dirname, '../templates/mocha.html'), 'utf8');
var $ = cheerio.load(template);

/**
 * Expose `serve`
 */

module.exports = function(fn) {
  server.listen(function() {
    var addr = server.address();
    fn(null, 'http://' + addr.address + ':' + addr.port);
  });
};

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
 * Serve the build files
 */

app.use(express.static(join(cwd, 'build')));
app.use(express.static(join(cwd, 'test')));

/**
 * Build the main index file each time
 */

app.get('/', function(req, res, next) {

  // fetch all the test files
  glob(join(cwd, 'test', '*.js'), function(err, assets) {
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

/**
 * Automatically close down the server upon exit
 */

process.on('SIGTERM', shutdown);
process.on('SIGQUIT', shutdown);

function shutdown() {
  server.close(function(){
    setTimeout(function() {
      process.exit();
    }, 2000);
  });
}
