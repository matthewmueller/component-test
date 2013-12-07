/**
 * Module Dependencies
 */

var args = module.exports = require('optimist').argv;
delete args.$0;
delete args._;
