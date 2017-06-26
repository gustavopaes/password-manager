'use strict';

const fs = require('fs');
const https = require('https');
const staticContent = require('node-static');
const crypto = require('crypto');
const NodeSession = require('node-session');
const file = new staticContent.Server('./public');

// Log messages and errors
const Console = require('console').Console;
const output = fs.createWriteStream('./logs/stdout.log');
const errorOutput = fs.createWriteStream('./logs/stderr.log');
global.logger = new Console(output, errorOutput);

const hostname  = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3443;

// user
const User = require('./src/user.js');

// Rotas
const RouteHome = require('./routes/home.js');
const RouteAdd = require('./routes/add.js');
const RouteUpdate = require('./routes/update.js');
const RouteDelete = require('./routes/delete.js');
const RouteLogin = require('./routes/login.js');

// User Session
const session = new NodeSession({
  secret: crypto.randomBytes(16).toString('hex'),
  expireOnClose: true,
  lifetime: 30 * 1000,
  driver: 'memory',
  cookie: 'session',
  secure: true,
  encrypt: true
});

// HTTPS certs
let options;
if(process.env.DEVELOPMENT) {
  options = {
    key: fs.readFileSync('self-certs/cert.key'),
    cert: fs.readFileSync('self-certs/cert.pem')
  };
} else {
  options = {
    key: fs.readFileSync('certs/cert.key'),
    cert: fs.readFileSync('certs/cert.pem')
  };
}

// Request trigger
const doRoute = (req, res) => {
  logger.log('->', req.url);

  session.startSession(req, res, () => {});

  // remove a última barra do path
  let pathRequest = req.url.replace(/\/$/, '');

  switch(pathRequest) {
    // GET /home
    case '':
      RouteHome(req, res);
    break;

    // POST /add
    case '/add':
      RouteAdd(req, res);
    break;

    // POST /update
    case '/update':
      RouteUpdate(req, res);
    break;

    // POST /delete
    case '/delete':
      RouteDelete(req, res);
    break;

    // POST /login
    case '/login':
    case '/user':
      RouteLogin(req, res);
    break;

    case '/token':
      res.end(req.session.get('token'));
    break;

    case '/logout':
      req.session.flush();

      // redirect to home
      res.writeHead(302, {'Location': '/'});
      res.end();
    break;

    // GET
    // Static File
    default:
      file.serve(req, res);
    break;
  }
}

// Rotas
https.createServer(options, doRoute).listen(port, hostname, () => {
  logger.log('up: https://%s:%d', hostname, port);
  console.log('up: https://%s:%d', hostname, port);
});
