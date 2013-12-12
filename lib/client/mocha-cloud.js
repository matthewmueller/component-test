function cloud(runner) {
  var tests = [];

  runner.on('pass', function(test) {
    tests.push({
      title: test.title,
      fullTitle: test.fullTitle(),
      duration: test.duration
    });
  });

  runner.on('fail', function(test, err) {
    tests.push({
      title: test.title,
      fullTitle: test.fullTitle(),
      err: {
        message: err.message,
        stack: err.stack
      }
    });
  });

  runner.on('end', function(){
    runner.stats.tests = tests;
    global.mochaResults = runner.stats;
  });
};
