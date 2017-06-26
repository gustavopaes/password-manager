'use strict';

const User = require('../src/user.js');
const readPostData = require('../src/utils.js').readPostData;
const isPOST = require('../src/utils.js').isPOST;

module.exports = function(req, res) {
  if(isPOST(req) === false) {
    res.statusCode = 403;
    return res.end('403 not allowed');
  }

  readPostData(req).then(data => {
    let login = data['user.login'];
    let passwd = data['user.passwd'];

    User(login, passwd)
      .then(user => {
        // adiciona item
        user.update({
          name: data['service.name'],
          passwd: data['service.passwd']
        });

        user.commit(passwd).then(() => {
          res.statusCode = 200;
          res.end('200 ok');
        });
      })
      // erro ou usuário inválido
      .catch(e => {
        res.statusCode = 403;
        res.end('403 not allowed');
      });
  });
}
