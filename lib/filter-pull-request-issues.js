var Q = require('q');
var _ = require('lodash');

module.exports = function (github, config) {

  var prNumbers = [];

  var getPRs = require('./get-prs')(github, config);

  // remove all issues with PRs
  var filterPullRequestIssues = function (issues) {

    return getPRs().
      then(function (prs) {
        prNumbers = _.pluck(prs, 'number');
        prNumbers = _.unique(prNumbers);
      }).
      then(function () {
        return Q.all(issues.map(hasRelatedPullRequest)).
          then(function (issues) {
            return _.filter(issues, function (issue) {
              return !!issue;
            });
          });
      });
  };

  // returns issue or undefined
  var hasRelatedPullRequest = function (issue) {

    // returns true iff there is some comment matching an
    // issue number corresponding to a PR
    return issue.comments.some(function (comment) {

      // detect PR
      // #123 -> check if 123 is a PR or an issue
      // http://whatever -> check if PR or issue
      var numbers = comment.body.
        match(new RegExp('#([0-9]+)', 'g'));

      if (numbers) {
        numbers = numbers.map(function (num) {
          return parseInt(num.substr(1), 10);
        });
        return numbers.some(function (number) {
          return prNumbers.indexOf(number) !== -1;
        });
      } else {
        return false;
      }
    }) ? null : issue;
  };

  return filterPullRequestIssues;
};
