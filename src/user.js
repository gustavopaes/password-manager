'use strict';

const path = require('path');
const fs = require('fs');
const encryptor = require('./encryptor');

const algorithm = 'aes256';
const encryptorOptions = {
  algorithm: algorithm,
  saveDecryptFile: false
};

const getUserData = login => {
  let filePath = path.join('./data', login);

  try {
    // valida se o arquivo existe e está disponível para leitura
    fs.accessSync(filePath, fs.constants && fs.constants.R_OK || fs.R_OK);
  } catch(e) {
    global.logger.log('\tgetUserData', e);
    return {
      code: 404
    };
  }

  try {
    let data = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));

    return {
      code: 200,
      data: data
    };
  } catch(e) {
    global.logger.log('\tgetUserData', filePath, e);
    return {
      code: 501
    };
  }
}

const saveUserData = (login, data) => {
  let filePath = path.join('./data', login);

  try {
    // valida se o arquivo existe e está disponível para leitura
    fs.accessSync(filePath, fs.constants && fs.constants.W_OK || fs.W_OK);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), {
      encoding: 'utf8'
    });
  } catch(e) {
    global.logger.log('\tsaveUserData', e);
    return {
      code: 403
    };
  }
}

const closeConnection = response => {
  // envia erro 403 para a conexão do usuário
  response.statusCode = 403;
  response.end('403 not allowed');
}

// valida se um usuario existe, tentando validar se o arquivo
// do hash de senha dele existe
const theUserExists = login => {
  return new Promise((resolve, reject) => {
    let dataPath = path.join('./data', `${login}.dat`);
    fs.access(dataPath, fs.constants && fs.constants.R_OK || fs.R_OK, err => {
      err ? reject(err) : resolve(dataPath);
    });
  });
}

// decriptografa o arquivo de hash, para poder
// validar a senha
const validateAndDecryptFile = (dataPath, password) => {
  return new Promise((resolve, reject) => {
    encryptor
      .decrypt(dataPath, password, encryptorOptions)
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}

class User {
  constructor(login, passwd) {
    let user = this;
    user.login = login;
    user.dataPath = '';
    user.data = {};

    return new Promise((resolve, reject) => {
      // valida se o usuário existe
      theUserExists(login)
        // sucesso, usuário existe
        // tenta descriptografar arquivo
        .then(dataPath => {
          user.dataPath = dataPath;
          return validateAndDecryptFile(dataPath, passwd);
        })

        // dispara ok para view
        .then(data => {
          try {
            user.data = JSON.parse(data);
          } catch(e) {
            user.data = {};
          }

          return resolve(user);
        })

        // erro, usuário não existe
        .catch(e => {
          global.logger.error('login error: ', e);
          reject(e);
        });
    });
  }

  add(service) {
    this.data.services = this.data.services || []
    this.data.services.push(service);

    return this;
  }

  update(service) {
    let services = this.data.services || [];
    for(let i = 0; i < services.length; i++) {
      if(service.name === services[i].name) {
        services[i] = service;
        break;
      }
    }

    return this;
  }

  delete(service) {
    this.data.services = this.data.services.filter(item => {
      return service.name !== item.name;
    });

    return this;
  }

  commit(passwd) {
    return new Promise((resolve, reject) => {
      encryptor
        .encrypt(JSON.stringify(this.data), this.dataPath, passwd)
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = (login, passwd) => new User(login, passwd);
