const qs = require('querystring');

exports.readPostData = request => {
  return new Promise(resolve => {
    let body = '';

    request.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });

    request.on('end', () => {
      resolve(qs.parse(body));
    });
  });
}

exports.isPOST = req => req.method == 'POST';