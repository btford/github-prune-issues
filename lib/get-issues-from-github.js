
var Q = require('q');
var _ = require('lodash');

module.exports = function (github, config) {

  var cacheIssues = require('./cache-issues')(github, config);
  var getRepoIssueCount = require('./get-repo-issue-count')(github, config);

  var getIssues = function () {
    return getRepoIssueCount().
      then(function (issueCount) {

        var numberOfPages = Math.ceil(issueCount / 100);

        var page,
          promises = [];

        for (page = 0; page < numberOfPages; page += 1) {
          promises.push(getIssuePage(page));
        }

        return Q.all(promises);
      }).
      then(function (issues) {
        issues = _.flatten(issues);
        issues = _.sortBy(issues, function (a) {
          return a.number;
        });
        issues = _.unique(issues, true, function (issue) {
          return issue.number;
        });
        return issues;
      }).
      then(function (issues) {
        return Q.all(issues.map(getIssueComments));
      }).
      then(cacheIssues);
  };

  var getIssuePage = function (page) {
    var def = Q.defer();

    var msg = _.defaults({
      state: 'open',
      sort: 'updated',
      page: page,
      per_page: 100
    }, config.msg); // TODO: can this config have additional unused properties?

    github.issues.repoIssues(msg, def.makeNodeResolver());

    return def.promise;
  };


  // get ALL the comments for some issue
  var getIssueComments = function (issue) {

    var numberOfPages = Math.ceil(issue.comments / 100);

    var page,
      promises = [];

    for (page = 0; page < numberOfPages; page += 1) {
      promises.push(getIssueCommentPage(issue.number, page));
    }

    return Q.all(promises).
      then(function (comments) {
        comments = _.flatten(comments);
        comments = _.sortBy(comments, function (a) {
          return a.id;
        });
        comments = _.unique(comments, true, function (comment) {
          return comment.id; // TODO: comment.id ???
        });

        issue.comments = comments;

        return issue;
      });
  };

  // get page N of some issue's comments
  var getIssueCommentPage = function (issue, page) {
    var def = Q.defer();

    if (typeof page !== 'number') {
      throw new Error('no page defined:' + page);
    }

    var msg = _.defaults({
      number: issue,
      page: page,
      per_page: 100
    }, config.msg);

    github.issues.getComments(msg, def.makeNodeResolver());

    return def.promise;
  };

  return getIssues;
};
