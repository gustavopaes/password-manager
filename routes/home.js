'use strict';

// view
const View = require('../src/view.js')('login');

module.exports = function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  res.end(View.render({
    title: 'Login'
  }));
}
