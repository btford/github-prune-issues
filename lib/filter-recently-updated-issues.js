var Q = require('q');
var _ = require('lodash');

module.exports = function (github, config) {

  var filterRecentlyUpdatesIssues = function (issues) {
    return _.filter(issues, function (issue) {
      return Date.parse(issue.updated_at) <= config.recently;
    });
  };

  return filterRecentlyUpdatesIssues;
};
