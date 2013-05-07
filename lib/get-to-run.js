var Q = require('q');
var _ = require('lodash');

module.exports = function (github, config, program) {

  // get whether or not to run the pruning
  var getToRun = function () {
    var def = Q.defer();

    program.confirm('Continue? ', function (answer) {
      def.resolve(answer);
    });

    return def.promise;
  };

  return getToRun;
};
