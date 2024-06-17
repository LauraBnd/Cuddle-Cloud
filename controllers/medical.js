const fs = require('fs');
const { sessions, getCookies, isSessionExpired } = require('../utils');


function handleMedical(req, res) {
    const cookies = getCookies(req);
    const sessionId = cookies.sessionId;
    let isLoggedIn = false;

    if (sessionId && sessions[sessionId] && !isSessionExpired(sessions[sessionId])) {
        isLoggedIn = true;
    }

    if (!isLoggedIn) {
        res.writeHead(302, { 'Location': '/login' });
        res.end();
        return;
    }

    
    fs.readFile('views/medical.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }


        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

module.exports = {
    handleMedical
};
