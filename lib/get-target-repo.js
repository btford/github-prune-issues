var Q = require('q');
var _ = require('lodash');

module.exports = function (github, config, program) {

  var getTargetRepo = function () {
    var def = Q.defer();


    program.prompt('user/repo:', function (repo) {
      var repoParts = repo.split('/');
      if (repoParts.length !== 2) {
        deferred.reject(new Error('Invalid repo given; should be in user/repo format'));
      }

      def.resolve({
        user: repoParts[0],
        repo: repoParts[1]
      });

    });

    return def.promise;
  };

  return getTargetRepo;
};
