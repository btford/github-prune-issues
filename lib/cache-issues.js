var Q = require('q');
var _ = require('lodash');
var fs = require('fs');

module.exports = function (github) {

  var cacheIssues = function (issues) {
    fs.writeFileSync(
      'issues.json',
      JSON.stringify(issues, null, 2));

    return issues;
  };

  return cacheIssues;
};
