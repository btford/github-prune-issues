var Q = require('q');
var _ = require('lodash');
var fs = require('fs');

// gets issues either from cache or Github, then caches them
module.exports = function (github, config) {

  var getIssues = function () {
    if (fs.existsSync('issues.json')) {
      return require('./get-issues-from-cache')(github, config)();
    } else {
      return require('./get-issues-from-github')(github, config)();
    }
  };

  return getIssues;
};
