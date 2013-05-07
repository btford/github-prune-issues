#!/usr/bin/env node

var GitHubApi = require('github');
var Q = require('q');
var _ = require('lodash');
var program = require('commander');
var path = require('path');

// CLI
// ---

program.
  usage('<config-file.js>').
  version(require('./package.json').version).
  parse(process.argv);

if (program.args.length !== 1) {
  console.log('Error: should be run with one argument');
  program.help();
}


// Config
// ------

var config = require(path.join(process.cwd(), program.args[0]));
config.msg = {
  user: config.target.user,
  repo: config.target.repo
};

// anything < this number is old; anything >= is recent
config.recently = Date.now() - (config.since*24*60*60*1000);


// Github Authentication
// ---------------------

var github = new GitHubApi({
  version: '3.0.0'
});

github.authenticate({
  type: 'basic',
  username: config.login.username,
  password: config.login.password
});



// Promise-based API
// -----------------

var getTargetRepo = require('./lib/get-target-repo')(github, config, program);
var getIssues = require('./lib/get-issues')(github, config, program);

var filterPullRequestIssues = require('./lib/filter-pull-request-issues')(github, config, program);
var filterRecentlyUpdatesIssues = require('./lib/filter-recently-updated-issues')(github, config, program);

var getToRun = require('./lib/get-to-run')(github, config, program);

var closeIssues = require('./lib/close-issues')(github, config, program);
var commentIssues = require('./lib/comment-issues')(github, config, program);


// Stats
// -----

var openIssues = 0,
  issuesWithPRs = 0,
  recentlyUpdatedIssues = 0;


// Start
// -----

getIssues().
  then(function (issues) {
    openIssues = issues.length;
    return issues;
  }).
  then(filterPullRequestIssues).
  then(function (issues) {
    issuesWithPRs = openIssues - issues.length;
    return issues;
  }).
  then(filterRecentlyUpdatesIssues).
  then(function (issues) {
    recentlyUpdatedIssues = openIssues - (issues.length - issuesWithPRs);
    return issues;
  }).
  then(function (issues) {
    console.log(openIssues + ' open issues');

    console.log(issuesWithPRs + ' issues cannot be closed because of an open pending PR');
    console.log(recentlyUpdatedIssues + ' issues cannot be closed because they have been updated recently');

    console.log(issues.length + ' closable issues');
    console.log((openIssues - issues.length) + ' issues will remain after pruning');

    return issues;
  }).
  then(function (issues) {
    if (issues.length === 0) {
      console.log('nothing to prune.');
      return;
    }
    return getToRun().
      then(function (toRun) {
        if (toRun) {
          return closeIssues(issues).
            then(function () {
              return commentIssues(issues);
            });
        }
      });
  }).
  then(function () {
    console.log('done.');
    process.exit(0);
  });
