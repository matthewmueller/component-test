/**
 * Handle javascript errors
 */

(function() {

  var pageErrors = [];

  /**
   * Listen for the error event
   */

  bind(window, 'error', onerror);

  /**
   * Catch the error
   *
   * @param {Error|String} err
   * @param {String} url
   * @param {String} line
   */

  function onerror(err, url, line) {
    if (1 == arguments.length) {
      pageErrors.push(err.message + '. Line: ' + err.lineno);
    } else {
      pageErrors.push('Error: ' + err + ' Line: ' + line);
    }

    window.pageError = pageErrors.join('\n');

    return false;
  }

  /**
   * Cross-browser event binding
   *
   * @param {Element} el
   * @param {String} event
   * @param {Function} fn
   */

  function bind(el, event, fn) {
     if (el.addEventListener) {
      el.addEventListener(event,fn,false);
     } else if (el.attachEvent) {
        el.attachEvent('on' + event, fn);
     } else {
        el['on' + event] = fn;
     }
  }
})();

