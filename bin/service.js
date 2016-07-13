require('babel-core/register');
require('babel-polyfill');


require('../db/config').startDB()
  .then(() => {
    var app = require('../src/');
    app.start(
      require('../config').config
    )
    .catch(function (error) {
      console.error(error);
    });
  });
