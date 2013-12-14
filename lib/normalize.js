/**
 * Normalize browser names
 */

module.exports = normalize;

// for binaries

function normalize(name) {
  if (!name) return '';
  switch (name = name.toLowerCase()) {
    case 'chrome':
      return 'google chrome';
    case 'canary':
    case 'chrome canary':
      return 'google chrome canary';
    case 'ie':
    case 'explorer':
    case 'internet explorer':
      return 'iexplore';
    case 'nightly':
    case 'firefox-nightly':
      // note: on linux, it's apparently firefox-nightly
      return 'firefoxnightly';
  }
  return name;
}

// for humans

normalize.human = function (name) {
  name = normalize(name);
  if (!name) return '';
  if (name === 'iexplore') return 'internet explorer';
  if (name === 'firefoxnightly') return 'firefox nightly';
  return name;
}