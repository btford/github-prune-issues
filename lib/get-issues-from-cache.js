var Q = require('q');
var _ = require('lodash');
var fs = require('fs');

module.exports = function (github) {

  var getIssuesFromCache = function () {
    var def = Q.defer();

    fs.readFile('issues.json', def.makeNodeResolver());

    return def.promise.then(function (data) {
      return JSON.parse(data);
    });
  };

  return getIssuesFromCache;
};
