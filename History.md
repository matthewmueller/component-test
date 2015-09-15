
0.1.5 / 2015-09-16
==================

The changes fix a bug where the tool hangs due to the user having a newer version of phantomjs in their path than what is compatible with the tool. The changes fix the issue by bundling its own version of phantomjs as a dependency instead of relying on the version of phantomjs installed in the developer's path. - #36

0.1.4 / 2014-10-16
==================

  * Release 0.1.4
  * Fix spawn on Windows - #33
  * add mocha-phantomjs hook to write coverage stats to a file
  * update mocha-phantomjs for custom reporter support

0.1.3 / 2014-01-24
==================

 * give an error if no build/ dir present
 * Updated misleading wording in travis/saucelabs docs (@jb55)
 * component-test2 => component-test thanks to @ask11
 * pass arguments through to mocha-phantomjs

0.1.2 / 2013-12-19
==================

 * pin mocha cloud
 * have errors pass through mochaResults

0.1.1 / 2013-12-19
==================

 * remove extra deps

0.1.0 / 2013-12-18
==================

 * add tunnel option to browser
 * add debug statements
 * listen for JS errors
 * prevent IE from going into compatibility mode
 * browser: choose which browser to open
 * phanton: cleanup stream handling
 * use the name property of component.json as the document’s title

0.0.1 / 2010-01-03
==================

  * Initial release
