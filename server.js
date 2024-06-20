const http = require('http');
const url = require('url');
const { manageHomeRoute, manageStyleCSS, manageImages, manageJSFiles } = require('./controllers/home');
const { manageProfileRoute, manageProfileUpdate, manageUploadPost, manageDeleteImage } = require('./controllers/profile');
const { manageServicesRoute } = require('./controllers/services');
const { manageContactRoute } = require('./controllers/contact');
const { manageRegistertRoute, manageRegisterPost } = require('./controllers/register');
const { manageLoginRoute, manageLoginPosts } = require('./controllers/login');
const manageLogoutRoute = require('./controllers/logout'); // import logout function as seen here, "{manageLogoutRoute}" -- doesn't find the function ????
const { saveSchedule, getSchedule, deleteSchedule} = require('./controllers/calendar');
const { adminPanel, adminGetUserImages, adminDeleteImage, adminDeleteAccount } = require('./controllers/admin');
const { manageForgotRoute } = require('./controllers/forgot');
const { manageMedicalRoute } = require('./controllers/medical');

// ss

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
  
  // ##Manages the "updateProfile" function
} else if (urlParser.pathname === '/updateProfile' && req.method === 'POST') {
  manageProfileUpdate(req, res);
  
  // ##Manages the "upload" function
} else if (urlParser.pathname === '/upload' && req.method === 'POST') {
  manageUploadPost(req, res);
} else if (urlParser.pathname === '/delete-image' && req.method === 'POST') {
  manageDeleteImage(req, res);


  // ##Manages the "logout" function
} else if (urlParser.pathname === '/logout' && req.method === 'POST') {
  manageLogoutRoute(req, res);
} else if (urlParser.pathname === '/saveSchedule' && req.method === 'POST') {
  saveSchedule(req, res);  // Add route to save schedule
} else if (urlParser.pathname === '/getSchedule' && req.method === 'GET') {
  getSchedule(req, res);  // Add route to get schedule
} else if (urlParser.pathname.startsWith('/deleteSchedule') && req.method === 'DELETE') {
  deleteSchedule(req, res);

  // ##Admin panel link!!!!
} else if (urlParser.pathname === '/admin' && req.method === 'GET') {
  adminPanel(req, res);
}else if (urlParser.pathname === '/admin/getUserImages' && req.method === 'POST') {
  adminGetUserImages(req, res);
}else if (urlParser.pathname === '/admin/deleteImage' && req.method === 'POST') {
  adminDeleteImage(req, res);
} else if (urlParser.pathname === '/admin/deleteAccount' && req.method === 'POST') {
  adminDeleteAccount(req, res);
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

