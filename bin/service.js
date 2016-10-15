require('babel-core/register');
require('babel-polyfill');

require('../db/config').startDB(require('../config').default)
  .then(() => {
    var app = require('../src/');
    app.start(require('../config').default)
    .catch(function (error) {
      console.error(error);
    });
  });
