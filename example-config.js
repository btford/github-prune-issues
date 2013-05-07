var fs = require('fs');

module.exports = {
  target: {
    user: 'angular',
    repo: 'angular.js'
  },
  login: {
    username: 'myUser',
    password: 'somePassword'
  },
  since: 30, // how many days ago
  message: fs.readFileSync('example-message.md', 'utf8')
};
