const http = require('http');
const url = require('url');
const { manageHomeRoute, manageStyleCSS } = require('./routes/home');

// This manages the server
const server = http.createServer((req, res) => {
  const urlParser = url.parse(req.url);
// ## Points to / that is index.html
  if (urlParser.pathname === '/' && req.method === 'GET') {
    manageHomeRoute(req, res);
// ##Finds the css files
  } else if (urlParser.pathname.startsWith('/css/') && req.method === 'GET') {
    manageStyleCSS(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Home page was not found');
  }
});


server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

