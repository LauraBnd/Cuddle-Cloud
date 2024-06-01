const http = require('http');
const url = require('url');
const { manageHomeRoute } = require('./routes/home');


const server = http.createServer((req, res) => {
  const urlParser = url.parse(req.url);

  if (urlParser.pathname === '/' && req.method === 'GET') {
    manageHomeRoute(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Home page was not found');
  }
});


server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

