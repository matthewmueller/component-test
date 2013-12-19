/**
 * Handle javascript errors
 *
 * TODO: make it work in IE9
 */

(function() {

  var pageErrors = [];

  /**
   * Listen for the error event
   */

  window.onerror = onerror;

  /**
   * Catch the error
   *
   * @param {String} msg
   * @param {String} url
   * @param {String} line
   * @param {String} col
   * @param {Error} error
   */

  function onerror(msg, url, line, col, error) {

    pageErrors.push('Error: ' + msg + ' on line: ' + line);
    if (error.stack) pageErrors.push(error.stack);

    window.mochaResults = { error: pageErrors.join('\n') };

    return false;
  }

})();

