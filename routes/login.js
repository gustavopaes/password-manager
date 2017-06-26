'use strict';

const User = require('../src/user.js');
const readPostData = require('../src/utils.js').readPostData;
const isPOST = require('../src/utils.js').isPOST;
const AES = require("crypto-js/aes");
const crypto = require('crypto');

// view
const View = require('../src/view.js')('user');

const redirUser = res => {
  res.writeHead(302, {'Location': '/user'});
  res.end();
}

const cryptPass = (services, randomKey) => {
  return services.map(item => {
    item.passwd = AES.encrypt(item.passwd, randomKey);
    return item;
  });
};

const validUserCredential = (login, passwd, req, res) => {
  User(login, passwd)
    // acesso liberado
    .then(user => {
      req.session.put('user', login+';'+passwd);
      req.session.put('token', user.token);

      if(isPOST(req) === true) {
        // faz o redir para evitar que a senha fique exposta no network
        redirUser(res);
      }

      user.data.services = cryptPass(user.data.services, user.token);

      res.end(View.render(user));
    })
    // erro ou usuário inválido
    .catch(e => {
      console.log(e);
      req.session.flush();
      setTimeout(function() {
        res.statusCode = 403;
        res.end('403 not allowed');
      }, parseInt(Math.random() * 10) * 1000);
    });
}

module.exports = function(req, res) {
  if(isPOST(req) === true) {
    req.session.flush();

    // valida usuário e senha do POST
    readPostData(req).then(data => {
      validUserCredential(data['user.login'], data['user.passwd'], req, res);
    });
  } else {
    if(req.session.has('user')) {
      if(req.url.match(/\/login/)) {
        redirUser(res);
      } else {
        // valida usuário e senha que estão salvos no cookie
        let userData = req.session.get('user').split(';');
        validUserCredential(userData[0], userData[1], req, res);
      }
    } else {
      if(isPOST(req) === false) {
        res.statusCode = 403;
        return res.end('403 not allowed');
      }
    }
  }
}
