const fs = require('fs');
const { sessions, getCookies, isSessionExpired } = require('../utils');


function handleServices(req, res) {
    const cookies = getCookies(req);
    const sessionId = cookies.sessionId;
    let isLoggedIn = false;

    if (sessionId && sessions[sessionId] && !isSessionExpired(sessions[sessionId])) {
        isLoggedIn = true;
    }
    fs.readFile('views/services.html', (err, data) => {
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
    handleServices
};
