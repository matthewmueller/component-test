/**
 * Module Dependencies
 */

var localtunnel = require('localtunnel');

/**
 * Expose `tunnel`
 */

module.exports = tunnel;

/**
 * Create the `tunnel`
 *
 * @param {Number} port
 * @param {Function} fn
 * @return {Client}
 * @api private
 */

function tunnel(port, fn) {
  var client = localtunnel.connect({
    host: 'http://localtunnel.me',
    port: port
  });

  client.on('url', function(url) {
    fn(null, url);
  });

  return client;
}
