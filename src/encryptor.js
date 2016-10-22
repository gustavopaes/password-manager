'use strict';

/**
 * Original: https://github.com/onmodulus/file-encryptor
 * Thanks to:
 * - inconceivableduck
 * - jackboberg 
 * - tzmanics
 */

const crypto = require('crypto');
const fs = require('fs');

const defaultOptions = {
  algorithm: 'aes256'
};

exports.encrypt = function(inputContent, outputPath, key, options) {
  return new Promise((resolve, reject) => {
    options = Object.assign({}, defaultOptions, options || {});

    let outputStream = fs.createWriteStream(outputPath);
    let cipher = crypto.createCipher(options.algorithm, new Buffer(key));

    outputStream.write(new Buffer(cipher.update(inputContent), 'binary'));
    outputStream.write(new Buffer(cipher.final('binary'), 'binary'));

    try {
      outputStream.end();
      outputStream.on('close', function() {
        resolve();
      });
    } catch(e) {
      try {
        fs.unlinkSync(outputPath);
      } catch(ef) {};
      reject(e);
    }
  });
};

exports.decrypt = function(inputPath, key, options) {
  return new Promise((resolve, reject) => {
    options = Object.assign({}, defaultOptions, options || {});

    let inputStream = fs.createReadStream(inputPath);
    let cipher = crypto.createDecipher(options.algorithm, new Buffer(key));
    let outputStream = '';

    inputStream.on('data', function(data) {
      let buf = new Buffer(cipher.update(data), 'binary');
      outputStream += buf.toString();
    });

    inputStream.on('end', function() {
      try {
        let buf = new Buffer(cipher.final('binary'), 'binary');
        outputStream += buf.toString();

        resolve(outputStream);
      } catch(e) {
        reject(e);
      }
    });
  });
};
