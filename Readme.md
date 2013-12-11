
# component-test

  Minimal configuration component test runner supporting browser testing, phantomjs, and saucelabs.

## Installation

    npm install -g component-test2

## API

### Browser

In browser testing

```
component test browser
```

![browser](https://i.cloudup.com/sQNerIUJuO.png)

### Phantom

Test using [phantomjs](http://phantomjs.org/).

You'll first need to install phantomjs. Using homebrew:

```
brew install phantomjs
```

Then you can run the tests:

```
component test phantom
```

![phantom](https://i.cloudup.com/z3wclSEdB4.png)

### Saucelabs

Test using [saucelabs](https://saucelabs.com/).

```
component test sauce -b "iphone 6.0 Mac OS 10.8, firefox 5 Windows XP"
```

![saucelabs](https://i.cloudup.com/gauAnVubef.png)

### Travis

First download the travis gem:

```
gem install travis
```

Encrypt your credentials:

```
travis encrypt SAUCE=username:password -r component/domify
```

Then add the browsers you want to test. Here's what the [component/domify](http://github.com/component/domify) `.travis.yml` looks like:

```
language: node_js
node_js:
  - '0.10'
env:
  global:
    - secure: PT7QR0DCGcZ+JjH4kpsaGHPYyjdbKbm44Wj9nsHA/QgIG/FRBCvsAU1OyaWHF8KCP6p0TEfhgeW+vUlZfxlbpDa4eSR8kjqkcNTR1CWKqYfjjQzBFzibrmLE+gKOnIRxFhdwUjzatRc1A2B+jX/03HoIgsUhnG83xiinz21dBJI=
  matrix:
    - BROWSER="iphone 6.1 Mac 10.8"
    - BROWSER="ipad 5.1 Mac 10.8"
    - BROWSER="firefox 6 Mac 10.6"d
```

And here's the result:

![travis](https://i.cloudup.com/zAWWsvZSiC.png)

## TODO

- Offer higher-level API over saucelabs in separate repo (like [zuul](https://github.com/defunctzombie/zuul))
- Use Travis API for encryption (eg. mimic behavior of `travis encrypt`)
- Provide API for adding browsers to .travis.yml

## License

(The MIT License)

Copyright (c) 2013 Matthew Mueller &lt;mattmuelle@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
