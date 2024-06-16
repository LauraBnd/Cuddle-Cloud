const http = require('http');
const url = require('url');
const { manageHomeRoute, manageStyleCSS, manageImages, manageJSFiles } = require('./routes/home');
const { manageProfileRoute, manageProfileUpdate, manageUploadPost } = require('./routes/profile');
const { manageServicesRoute } = require('./routes/services');
const { manageContactRoute } = require('./routes/contact');
const { manageRegistertRoute, manageRegisterPost } = require('./routes/register');
const { manageLoginRoute, manageLoginPosts } = require('./routes/login');
const { adminPanel } = require('./routes/admin');
const { manageForgotRoute } = require('./routes/forgot');
const { manageMedicalRoute } = require('./routes/medical');



// This manages the server
const server = http.createServer((req, res) => {
  const urlParser = url.parse(req.url);
// ## Points to / that is index.html
  if (urlParser.pathname === '/' && req.method === 'GET') {
    manageHomeRoute(req, res);
// ##Finds the css files location
  } else if (urlParser.pathname.startsWith('/css/') && req.method === 'GET') {
    manageStyleCSS(req, res);
// ##Finds the iamges files location
  } else if (urlParser.pathname.startsWith('/images/') && req.method === 'GET') {
    manageImages(req, res);
    // ##Finds the js files location
  } else if (urlParser.pathname.startsWith('/js/') && req.method === 'GET') {
    manageJSFiles(req, res);
// ##Manages the /profile page
  } else if (urlParser.pathname === '/profile' && req.method === 'GET') {
    manageProfileRoute(req, res);
// ##Manages the /services page
  } else if (urlParser.pathname === '/services' && req.method === 'GET') {
    manageServicesRoute(req, res);
// ##Manages the /contact page
} else if (urlParser.pathname === '/contact' && req.method === 'GET') {
  manageContactRoute(req, res);
// ##Manages the /medical page
} else if (urlParser.pathname === '/medical' && req.method === 'GET') {
  manageMedicalRoute(req, res);

// ##Manages the /register page
} else if (urlParser.pathname === '/register' && req.method === 'GET') {
  manageRegistertRoute(req, res);
  // ##Manages the /register posts when user registers
} else if (urlParser.pathname === '/register' && req.method === 'POST') {
  manageRegisterPost(req, res);
  // ##Manages the /login page
} else if (urlParser.pathname === '/login' && req.method === 'GET') {
  manageLoginRoute(req, res);
  // ##Manages the /login posts when user logins
} else if (urlParser.pathname === '/login' && req.method === 'POST') {
  manageLoginPosts(req, res);

  // ##Manages the "logout" funciton
} else if (urlParser.pathname === '/logout' && req.method === 'POST') {
  manageLogoutRoute(req, res);


  // ##Admin panel link!!!!
} else if (urlParser.pathname === '/admin' && req.method === 'GET') {
  adminPanel(req, res);
    // ##Manages the /forgot page
} else if (urlParser.pathname === '/forgot' && req.method === 'GET') {
  manageForgotRoute(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Home page was not found');
  }
});


server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

