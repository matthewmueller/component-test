#!/usr/bin/env node

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var osenv = require('osenv');

/**
 * Configuration path.
 */

exports.path = path.resolve(osenv.home(), '.component-test.json');

/**
 * Read config.
 *
 * @return {Object}
 * @api public
 */

exports.read = function(){
  var json, obj;

  // read
  try {
    json = fs.readFileSync(exports.path, 'utf8');
  } catch (err) {
    return {};
  }

  // parse
  try {
    obj = JSON.parse(json);
  } catch (err) {
    console.error('\n  Failed to parse ' + exports.path + '\n');
    console.error('\n  Please make sure it\'s valid json\n');
    process.exit(1);
  }

  return obj;
};

/**
 * Save config `obj`.
 *
 * @param {Object} obj
 * @api public
 */

exports.save = function(obj){
  var json = JSON.stringify(obj, null, 2) + '\n';
  fs.writeFileSync(exports.path, json);
};
