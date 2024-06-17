const fs = require('fs');
const path = require('path');
const { sessions, getCookies, isSessionExpired } = require('../utils');


function handleHome(req, res) {
    const cookies = getCookies(req);
    const sessionId = cookies.sessionId;
    let isLoggedIn = false;

    if (sessionId && sessions[sessionId] && !isSessionExpired(sessions[sessionId])) {
        isLoggedIn = true;
    }

    fs.readFile('views/index.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        let updatedData = data.toString();

        // Replace logout button placeholder if user is logged in
        if (isLoggedIn) {
            updatedData = updatedData.replace(/<!-- LOGOUT BUTTON PLACEHOLDER -->/g, '<form action="/logout" method="post"><button type="submit">Logout</button></form>');
        } else {
            updatedData = updatedData.replace(/<!-- LOGOUT BUTTON PLACEHOLDER -->/g, '');
        }

        // Replace login button placeholder if user is not logged in
        if (!isLoggedIn) {
            updatedData = updatedData.replace(/<!-- LOGIN BUTTON PLACEHOLDER -->/g, '<a href="login">Log in!</a>');
        } else {
            updatedData = updatedData.replace(/<!-- LOGIN BUTTON PLACEHOLDER -->/g, '');
        }

        // Replace register button placeholder if user is not logged in
        if (!isLoggedIn) {
            updatedData = updatedData.replace(/<!-- REGISTER BUTTON PLACEHOLDER -->/g, '<a href="register">Sign Up!</a>');
        } else {
            updatedData = updatedData.replace(/<!-- REGISTER BUTTON PLACEHOLDER -->/g, '');
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(updatedData);
    });
}

function handleStyles(req, res) {
    const cssPath = path.join(__dirname, '../public/css', path.basename(req.url));
    fs.readFile(cssPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('CSS Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
    });
}

function handleImages(req, res) {
    const imagePath = path.join(__dirname, '../public/images', path.basename(req.url));
    fs.readFile(imagePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Image Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data);
    });
}

function handleScripts(req, res) {
    const jsPath = path.join(__dirname, '../public/js', path.basename(req.url));
    fs.readFile(jsPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('JavaScript File Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
    });
}

module.exports = {
    handleHome,
    handleStyles,
    handleImages,
    handleScripts
};
