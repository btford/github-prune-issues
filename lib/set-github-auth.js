var Q = require('q');
var _ = require('lodash');

module.exports = function (github, config, program) {

  var setGithubAuth = function () {
    var def = Q.defer();

    program.prompt('username: ', function (user) {
      program.password('password: ', function (password) {
        github.authenticate({
          type: 'basic',
          username: user,
          password: password
        });

        def.resolve();
      });
    });

    return def.promise;
  };

  return setGithubAuth;
};
