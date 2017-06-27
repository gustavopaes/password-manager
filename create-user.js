'use strict';

const path = require('path');
const encryptor = require('./src/encryptor');
const argv = process.argv.slice(2);

if(argv.length != 2) {
  console.log('Usage: node create-user.js USERNAME PASSWORD');
  process.exit(1);
}

encryptor
  .encrypt(JSON.stringify({
    services: []
  }), path.join('./data', `${argv[0]}.dat`), argv[1])
  .then(() => {
    console.log('User file created!');
    process.exit(0);
  })
  .catch(err => {
    console.log('Error: ', e);
    process.exit(1);
  });
