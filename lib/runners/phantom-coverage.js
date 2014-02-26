var fs = require('fs');
var system = require('system');

module.exports = {
  afterEnd: function (reporter) {
    var file = reporter.config.settings.coverage;
    if (!file)
      return;
    var coverage = reporter.page.evaluate(function () {
      // support istanbul and jscoverage for now
      return window.__coverage__ || window._$jscoverage;
    });
    if (!coverage)
      return;
    fs.write(file, JSON.stringify(coverage), 'w');
  }
};
