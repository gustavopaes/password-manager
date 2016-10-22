const http = require('http');
const static = require('node-static');
const crypto = require('crypto');
const NodeSession = require('node-session');
const file = new static.Server('./public');

const hostname = '127.0.0.1';
const port = 3000;

// user
const User = require('./src/user.js');

// Rotas
const RouteHome = require('./routes/home.js');
const RouteAdd = require('./routes/add.js');
const RouteLogin = require('./routes/login.js')

// Random string
// generateId :: Integer -> String

const session = new NodeSession({
  secret: crypto.randomBytes(16).toString('hex'),
  expireOnClose: true,
  lifetime: 30 * 1000,
  driver: 'memory',
  cookie: 'session',
  encrypt: true
});

// Rotas
const server = http.createServer((req, res) => {
  //console.log('-> %s', req.url);

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

    // POST /login
    case '/login':
    case '/user':
      RouteLogin(req, res);
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
});

server.listen(port, hostname, () => {
  console.log('listen!');
});
