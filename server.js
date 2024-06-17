const http = require('http');
const url = require('url');
const { handleHome, handleStyles, handleImages, handleScripts } = require('./controllers/home');
const { handleProfile, handleUpload, handleUpdateProfile  } = require('./controllers/profile');
const { handleContact } = require('./controllers/contact');
const { handleServices } = require('./controllers/services');
const { handleForgot } = require('./controllers/forgot');
const { handleMedical } = require('./controllers/medical');
const { handleAdmin } = require('./controllers/admin');
const { handleLoginPage, handleLogin } = require('./controllers/login');
const { handleDashboard } = require('./controllers/dashboard');
const { handleRegistrationPage, handleRegistration } = require('./controllers/register');
const handleLogout = require('./controllers/logout');



const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);

    if (parsedUrl.pathname === '/' && req.method === 'GET') {
        handleHome(req, res);
    } else if (parsedUrl.pathname.startsWith('/css/') && req.method === 'GET') {
        handleStyles(req, res);
    } else if (parsedUrl.pathname.startsWith('/images/') && req.method === 'GET') {
        handleImages(req, res);
    } else if (parsedUrl.pathname.startsWith('/js/') && req.method === 'GET') {
        handleScripts(req, res);
    } else if (parsedUrl.pathname === '/login' && req.method === 'GET') {
        handleLoginPage(req, res);
    } else if (parsedUrl.pathname === '/login' && req.method === 'POST') {
        handleLogin(req, res);
    } else if (parsedUrl.pathname === '/dashboard' && req.method === 'GET') {
        handleDashboard(req, res);
    } else if (parsedUrl.pathname === '/register' && req.method === 'GET') {
        handleRegistrationPage(req, res);
    } else if (parsedUrl.pathname === '/register' && req.method === 'POST') {
        handleRegistration(req, res);
    } else if (parsedUrl.pathname === '/logout' && req.method === 'POST') {
        handleLogout(req, res);
    } else if (parsedUrl.pathname === '/profile' && req.method === 'GET') {
        handleProfile(req, res);
    } else if (parsedUrl.pathname === '/upload' && req.method === 'POST') {
        handleUpload(req, res);
    } else if (parsedUrl.pathname === '/contact' && req.method === 'GET') {
        handleContact(req, res);
    } else if (parsedUrl.pathname === '/services' && req.method === 'GET') {
        handleServices(req, res);
    } else if (parsedUrl.pathname === '/forgot' && req.method === 'GET') {
        handleForgot(req, res);
    } else if (parsedUrl.pathname === '/admin' && req.method === 'GET') {
        handleAdmin(req, res);
    } else if (parsedUrl.pathname === '/medical' && req.method === 'GET') {
        handleMedical(req, res);
    } else if (parsedUrl.pathname === '/updateProfile' && req.method === 'POST') {
        handleUpdateProfile(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
