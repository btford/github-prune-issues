var Q = require('q');
var _ = require('lodash');

module.exports = function (github, config) {

  var getRepoIssueCount = function () {
    var def = Q.defer();

    github.repos.get(config.msg, function (err, res) {
      if (err) {
        def.reject(new Error(err));
      } else {
        def.resolve(res.open_issues);
      }
    });

    return def.promise;
  };

  return getRepoIssueCount;
};
